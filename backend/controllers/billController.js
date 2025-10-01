import Bill from "../models/billModel.js";
import Product from "../models/productModel.js";
import Tax from "../models/taxModel.js";
import Inventory from "../models/inventoryModel.js";
import { v4 as uuidv4 } from "uuid";
import { sendEmailWithAttachment } from "../utils/emailService.js";
import { generateBillPdfBuffer } from "../utils/pdfService.js";

// @desc   Create a new bill and update inventory accordingly
// @route  POST /api/bills
// @access Protected (Cashier only)


// @desc   Get all bills of a specific store
// @route  GET /api/bills/store/:storeId
// @access Protected (Cashier only)

export const getBillsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const bills = await Bill.find({ store: storeId })
      .sort({ createdAt: -1 }) // Optional: latest bills first
      .populate("store", "storeName")
      .populate("items.productName")
      
      // Optional: populate store details
      .exec();

    // Always return 200 with an array (empty if none)
    res.status(200).json({ bills: bills || [] });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};








export const createBill = async (req, res) => {
  try {
    const {
      items,
      storeId,
      customerName,
      customerPhone,
      customerEmail,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in bill" });
    }

    let subtotal = 0;
    const detailedItems = [];
    let totalTaxAmount = 0;
    const taxBreakdown = [];

    for (const item of items) {
      const { productId, quantity = 1 } = item;

      const product = await Product.findById(productId).populate("category");
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      const inventory = await Inventory.findOne({
        store: storeId,
        product: productId,
        category: product.category._id,
      });

      if (!inventory || inventory.quantity < quantity) {
        return res.status(400).json({
          message: `Product '${product.productName}' is not available in required quantity in inventory`,
        });
      }

      const price = product.price;
      const total = price * quantity;
      subtotal += total;

      const applicableTaxes = await Tax.find({
        category: product.category._id,
        isActive: true,
      });

      let itemTaxAmount = 0;
      const itemTaxDetails = [];

      for (const tax of applicableTaxes) {
        const taxAmt =
          tax.type === "percentage" ? (total * tax.value) / 100 : tax.value;

        itemTaxAmount += taxAmt;

        const existingTax = taxBreakdown.find((t) => t.taxName === tax.name);
        if (existingTax) {
          existingTax.taxAmount += taxAmt;
        } else {
          taxBreakdown.push({
            taxName: tax.name,
            taxPercentage: tax.type === "percentage" ? tax.value : 0,
            taxAmount: taxAmt,
          });
        }

        itemTaxDetails.push({
          taxName: tax.name,
          taxPercentage: tax.type === "percentage" ? tax.value : 0,
          taxAmount: parseFloat(taxAmt.toFixed(2)),
        });
      }

      totalTaxAmount += itemTaxAmount;

      detailedItems.push({
        productId: product._id,
        productName: product.productName,
        quantity,
        price,
        total,
        taxes: itemTaxDetails,
      });

      inventory.quantity -= quantity;
      inventory.lastUpdated = new Date();
      await inventory.save();
    }

    taxBreakdown.forEach((t) => {
      t.taxAmount = parseFloat(t.taxAmount.toFixed(2));
    });

    const totalAmount = parseFloat((subtotal + totalTaxAmount).toFixed(2));

    const bill = new Bill({
      billId: uuidv4(),
      items: detailedItems,
      totalAmount,
      grandTotal: totalAmount,
      taxAmount: totalTaxAmount,
      store: storeId,
      customerName,
      customerPhone,
      customerEmail,
      taxBreakdown,
    });

    await bill.save();

    // Send email if customerEmail provided
    if (customerEmail) {
      try {
        const pdfBuffer = await generateBillPdfBuffer(bill);
        await sendEmailWithAttachment({
          to: customerEmail,
          subject: `Your Invoice - ${bill.billId}`,
          text: `Hi ${customerName || "Customer"},\n\nThank you for your purchase. Please find your invoice attached.`,
          html: `<p>Hi ${customerName || "Customer"},</p><p>Thank you for your purchase. Please find your invoice attached.</p>`,
          attachments: [
            {
              filename: `invoice-${bill.billId}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      } catch (emailErr) {
        console.error("Failed to send invoice email:", emailErr.message);
        // Do not fail the billing because of email issues
      }
    }

    return res.status(201).json({
      message: "Bill created successfully",
      bill,
    });

  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc   Send invoice email for an existing bill
// @route  POST /api/bills/:billId/send-email
// @access Protected (Cashier only)
export const sendBillEmail = async (req, res) => {
  try {
    const { billId } = req.params;
    const { email } = req.body || {};

    const bill = await Bill.findOne({ billId }).populate("items.productName");
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const to = email || bill.customerEmail;
    if (!to) {
      return res.status(400).json({ message: "No email provided on request or stored on bill" });
    }

    const pdfBuffer = await generateBillPdfBuffer(bill);
    await sendEmailWithAttachment({
      to,
      subject: `Your Invoice - ${bill.billId}`,
      text: `Hi ${bill.customerName || "Customer"},\n\nPlease find your invoice attached.`,
      html: `<p>Hi ${bill.customerName || "Customer"},</p><p>Please find your invoice attached.</p>`,
      attachments: [
        { filename: `invoice-${bill.billId}.pdf`, content: pdfBuffer },
      ],
    });

    return res.status(200).json({ message: "Invoice email sent" });
  } catch (error) {
    console.error("Error sending bill email:", error);
    res.status(500).json({ message: "Failed to send invoice email" });
  }
};
