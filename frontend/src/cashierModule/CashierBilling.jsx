import React, { useState, useEffect, useRef } from "react";
import jsPDF  from "jspdf";
import autoTable from 'jspdf-autotable';
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";




const CashierBilling = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [taxMap, setTaxMap] = useState({});
  const [bills, setBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [lastCreatedBill, setLastCreatedBill] = useState(null);
  const [sendEmailCurrent, setSendEmailCurrent] = useState("");
  const [sendEmailPast, setSendEmailPast] = useState("");

  const cartInvoiceRef = useRef();
  const pastBillRef = useRef();

  // Helper function to get product name consistently
  const getProductName = (item) => {
    if (!item || !item.product) return "Unnamed Product";
    
    // Try different possible paths for product name
    return item.product.productName?.productName || 
           item.product.name || 
           item.product.productName || 
           "Unnamed Product";
  };

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await api.get(`/api/inventory/cashier`);
        setInventory(data);
        setFilteredInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    const fetchBills = async () => {
      try {
        const storeId = Cookies.get("cashier_storeId");
        const { data } = await api.get(`/api/bills/store/${storeId}`);
        setBills(data?.bills || []);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      }
    };

    fetchInventory();
    fetchBills();
  }, []);

  // Search functionality with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setFilteredInventory(inventory);
        return;
      }

      try {
        const { data } = await api.get(`/api/inventory/search?q=${encodeURIComponent(searchQuery)}`);
        setFilteredInventory(data);
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("Search failed. Please try again.");
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, inventory, api]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const fetchTaxByCategory = async (categoryId) => {
    if (!categoryId || taxMap[categoryId]) return;
    try {
      const { data } = await api.get(`/api/tax/category/${categoryId}`);
      if (data.length > 0) {
        setTaxMap((prev) => ({ ...prev, [categoryId]: data[0] }));
      }
    } catch (error) {
      console.error("Failed to fetch tax:", error);
    }
  };

  const addToCart = async () => {
    const selected = filteredInventory.find((item) => item._id === selectedProductId);
    if (!selected) return;


    await fetchTaxByCategory(selected.category?._id);

    const product = selected.product;
    const existingIndex = cart.findIndex(
      (item) =>
        item._id === selected._id &&
        item.product?.size?._id === product?.size?._id &&
        item.product?.color?._id === product?.color?._id
    );

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...selected, quantity }]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const calculateTaxAmount = (item) => {
    const categoryId = item.category?._id;
    const tax = taxMap[categoryId];
    if (!tax || tax.type !== "percentage") return 0;

    const price = item.product?.price || 0;
    const total = price * item.quantity;
    return (total * tax.value) / 100;
  };

  const calculateTotalWithTax = () => {
    return cart.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const subtotal = price * item.quantity;
      const taxAmount = calculateTaxAmount(item);
      return acc + subtotal + taxAmount;
    }, 0);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.max(1, (prev || 1) + 1));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, (prev || 1) - 1));
  };

  const updateCartItemQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const nextQty = Math.max(1, (updated[index].quantity || 1) + delta);
      updated[index] = { ...updated[index], quantity: nextQty };
      return updated;
    });
  };

  const removeFromCart = (index) => {
    const item = cart[index];
    const productName = getProductName(item);
    
    toast.success(`${productName} removed from cart`);
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

   const generatePDF = (dataRef, dataType = "cart") => {
  const doc = new jsPDF();
  const title = dataType === "cart" ? "Invoice" : "Invoice (Past Bill)";

  const pageWidth = doc.internal.pageSize.getWidth();
  const headerHeight = 22;
  const footerHeight = 12;

  const drawHeader = () => {
    doc.setFillColor(3, 78, 71); // teal-900
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Groovy Billing", 12, 13);
    doc.setFontSize(11);
    doc.text(title, pageWidth - 12, 13, { align: 'right' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    const ts = new Date().toLocaleString();
    doc.text(`Generated: ${ts}`, 12, 19);
  };

  const drawFooter = (pageNum) => {
    const pageCount = doc.getNumberOfPages();
    doc.setFillColor(229, 231, 235); // gray-200
    doc.rect(0, doc.internal.pageSize.getHeight() - footerHeight, pageWidth, footerHeight, 'F');
    doc.setTextColor(55, 65, 81); // gray-700
    doc.setFontSize(9);
    doc.text(`Page ${pageNum} of ${pageCount}`, pageWidth - 12, doc.internal.pageSize.getHeight() - 5, { align: 'right' });
    doc.text("Thank you for shopping with us!", 12, doc.internal.pageSize.getHeight() - 5);
  };

  const startYBase = headerHeight + 8;

  // Customer block
  doc.setTextColor(17, 24, 39); // gray-900
  doc.setFontSize(12);
  if (dataType === "cart") {
    doc.text(`Customer: ${customerName || 'N/A'}`, 12, startYBase);
    doc.text(`Phone: ${customerPhone || 'N/A'}`, 12, startYBase + 6);
  } else if (dataType === "past" && selectedBill) {
    doc.text(`Customer: ${selectedBill.customerName || 'N/A'}`, 12, startYBase);
    doc.text(`Phone: ${selectedBill.customerPhone || 'N/A'}`, 12, startYBase + 6);
    doc.text(`Date: ${new Date(selectedBill.createdAt).toLocaleString()}`, 12, startYBase + 12);
  }

  const tableHead = [["Product", "Qty", "Price", "Tax", "Total"]];
  let tableBody = [];

  if (dataType === "cart") {
    tableBody = cart.map((item) => {
      const price = item.product?.price || 0;
      const subtotal = price * item.quantity;
      const tax = calculateTaxAmount(item);
      const total = subtotal + tax;
      
      
      return [
        getProductName(item),
        item.quantity,
        `₹${price.toFixed(2)}`,
        `₹${tax.toFixed(2)}`,
        `₹${total.toFixed(2)}`,
      ];
    });
  } else if (dataType === "past" && selectedBill) {
    tableBody = selectedBill.items.map((item) => {
      const taxAmount = item.taxes.reduce((acc, t) => acc + t.taxAmount, 0);
      return [
        item.productName?.productName || "Unnamed Product",
        item.quantity,
        `₹${Number(item.price).toFixed(2)}`,
        `₹${Number(taxAmount).toFixed(2)}`,
        `₹${Number(item.total + taxAmount).toFixed(2)}`,
      ];
    });
  }

  // Draw header initially
  drawHeader();

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: dataType === 'past' ? startYBase + 16 : startYBase + 10,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [229, 231, 235],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [3, 78, 71], // teal-900
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [31, 41, 55], // gray-800
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // gray-50
    },
    didDrawPage: (data) => {
      drawHeader();
      drawFooter(doc.internal.getNumberOfPages());
    },
  });

  const afterTableY = doc.lastAutoTable?.finalY || (startYBase + 24);
  doc.setFontSize(12);
  doc.setTextColor(3, 78, 71);
  const grand = dataType === 'past' && selectedBill ? Number(selectedBill.grandTotal).toFixed(2) : calculateTotalWithTax().toFixed(2);
  doc.text(`Grand Total: ₹${grand}`, pageWidth - 12, afterTableY + 8, { align: 'right' });

  // Finalize with header/footer on last page
  const totalPages = doc.getNumberOfPages();
  doc.setPage(totalPages);
  drawFooter(totalPages);

  doc.save(`${title}.pdf`);
};



  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty. Please add products before checkout.");
      return;
    }
    
    if (!customerName || !customerPhone) {
      toast.error("Please enter customer name and phone number.");
      return;
    }
    
    if (customerEmail && !/^\S+@\S+\.\S+$/.test(customerEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(customerPhone)) {
      toast.error("Customer phone number must be exactly 10 digits.");
      return;
    }

    // Show confirmation dialog
    const totalAmount = calculateTotalWithTax();
    const confirmMessage = `Confirm billing for ${customerName}?\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\nItems: ${cart.length}\n\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      toast.info("Billing cancelled");
      return;
    }


    try {
      const storeId = Cookies.get("cashier_storeId");
      const role = Cookies.get("role");

      if (!storeId || role !== "Cashier") {
toast.error("Invalid session or role. Please log in.");
        return;
      }

      const enrichedCart = cart.map((item) => ({
        productId: item.product?._id,
        quantity: item.quantity,
      }));

      const billingPayload = {
        items: enrichedCart,
        storeId,
        customerName,
        customerPhone,
        customerEmail,
      };

      const { data: result } = await api.post(`/api/bills/checkout`, billingPayload);
toast.success("Bill created successfully!");
      setLastCreatedBill(result.bill || null);
      setSendEmailCurrent(customerEmail || "");

      setTimeout(() => {
        generatePDF(cartInvoiceRef);
      }, 700);

      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
    } catch (error) {
      console.error("Checkout error:", error.message);
toast.error("Checkout error: " + error.message);
    }
  };

  return (
    <div className="p-">
      <h1 className="text-2xl font-bold mb-4">Billing System</h1>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 w-full md:w-1/3"
        />
        <input
  type="tel"
  placeholder="Customer Phone"
  value={customerPhone}
  maxLength={10}
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomerPhone(value.slice(0, 10)); // ensures max 10 digits
    }
  }}
  className="border p-2 w-full md:w-1/3"
/>
        <input
          type="email"
          placeholder="Customer Email (optional)"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="border p-2 w-full md:w-1/3"
        />

      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-2 rounded flex-1 max-w-md"
          />
          <button
            onClick={() => {
              setSearchQuery("");
              setFilteredInventory(inventory);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-1">
            Found {filteredInventory.length} product(s) matching "{searchQuery}"
          </p>
        )}
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select a product</option>
          {filteredInventory.map((item) => (
            <option key={item._id} value={item._id}>
              {getProductName(item)}{" "}
              | {(item.category?.categoryName || "No Category")} |{" "}
              {(item.product?.size?.sizeName || "No Size")} |{" "}
              {(item.product?.color?.colorName || "No Color")}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border p-2 w-20"
        />

        <button
          onClick={addToCart}
          className="bg-teal-950 hover:bg-teal-900 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>

<div
  ref={cartInvoiceRef}
  style={{ color: "#000", backgroundColor: "#fff" }}
  className="bg-white p-6 shadow rounded"
>
        <h2 className="text-xl font-semibold mb-4">Invoice</h2>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-lg">Your cart is empty</p>
            <p className="text-sm">Add products to start billing</p>
          </div>
        ) : (
          <>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Tax</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => {
                  const price = item.product?.price || 0;
                  const subtotal = price * item.quantity;
                  const taxAmount = calculateTaxAmount(item);
                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <div>
                          <div className="font-medium">
                            {getProductName(item)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.category?.categoryName || "No Category"} | 
                            {item.product?.size?.sizeName || "No Size"} | 
                            {item.product?.color?.colorName || "No Color"}
                          </div>
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItemQuantity(index, -1)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(index, 1)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="border px-4 py-2">₹{price}</td>
                      <td className="border px-4 py-2">₹{taxAmount.toFixed(2)}</td>
                      <td className="border px-4 py-2">
                        ₹{(subtotal + taxAmount).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove "${getProductName(item)}" from cart?`)) {
                              removeFromCart(index);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          title="Remove from cart"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  if (cart.length > 0 && window.confirm("Clear entire cart? This action cannot be undone.")) {
                    setCart([]);
                    toast.success("Cart cleared");
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                disabled={cart.length === 0}
              >
                🗑️ Clear Cart
              </button>
              <div className="text-right font-bold text-lg">
                Grand Total (with tax): ₹{calculateTotalWithTax().toFixed(2)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-4">


        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="bg-teal-950 hover:bg-teal-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-semibold"
        >
          💳 Checkout (₹{calculateTotalWithTax().toFixed(2)})
        </button>
        {lastCreatedBill && (
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email to send invoice"
              value={sendEmailCurrent}
              onChange={(e) => setSendEmailCurrent(e.target.value)}
              className="border p-2"
            />
            <button
              onClick={async () => {
                if (!/^\S+@\S+\.\S+$/.test(sendEmailCurrent)) {
toast.error("Enter a valid email to send invoice.");
                  return;
                }
                try {
                  await api.post(`/api/bills/${lastCreatedBill.billId}/send-email`, { email: sendEmailCurrent });
toast.success("Invoice sent to customer");
                } catch (err) {
                  console.error(err);
toast.error("Failed to send invoice");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Send Invoice
            </button>
          </div>
        )}
      </div>

      {/* Dropdown to view old bills */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-2">View Previous Bills</h2>
        <select
          value={selectedBillId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedBillId(id);
            const bill = bills.find((b) => b._id === id);
            setSelectedBill(bill || null);
          }}
          className="border p-2 w-full md:w-1/2"
        >
          <option value="">Select a bill</option>
          {bills.map((bill) => (
            <option key={bill._id} value={bill._id}>
              {bill.billId} — {bill.customerName} — ₹{bill.totalAmount}
            </option>
          ))}
        </select>
      </div>

      {/* Current Invoice */}

      {/* Past Bill View */}
      {selectedBill && (
<div
  ref={pastBillRef}
  style={{ color: "#000", backgroundColor: "#fff" }}
  className="bg-white p-6 mt-6 shadow rounded"
>
          <h3 className="text-lg font-bold mb-2">Bill Details</h3>
          <p>
            <strong>Customer:</strong> {selectedBill.customerName}
          </p>
          <p>
            <strong>Phone:</strong> {selectedBill.customerPhone}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedBill.createdAt).toLocaleString()}
          </p>

          <table className="w-full table-auto border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Tax</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.items.map((item, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    {item.productName?.productName || "Unnamed Product"}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">₹{item.price}</td>
                  <td className="border px-4 py-2">
                    {item.taxes.map((t, j) => (
                      <div key={j}>
                        {t.taxName}: ₹{t.taxAmount}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    ₹
                    {item.total +
                      item.taxes.reduce((acc, t) => acc + t.taxAmount, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 font-bold text-lg">
            Grand Total: ₹{selectedBill.grandTotal}
          </div>

          <button
            onClick={() => generatePDF(null,"past")}
            className="bg-blue-600 mt-4 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="email"
              placeholder="Email to send invoice"
              value={sendEmailPast}
              onChange={(e) => setSendEmailPast(e.target.value)}
              className="border p-2"
            />
            <button
              onClick={async () => {
                const emailToUse = sendEmailPast || selectedBill.customerEmail;
                if (!emailToUse || !/^\S+@\S+\.\S+$/.test(emailToUse)) {
toast.error("Enter a valid email to send invoice.");
                  return;
                }
                try {
                  await api.post(`/api/bills/${selectedBill.billId}/send-email`, { email: emailToUse });
toast.success("Invoice sent to customer");
                } catch (err) {
                  console.error(err);
toast.error("Failed to send invoice");
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Send Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierBilling;
