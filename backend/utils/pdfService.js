import PDFDocument from "pdfkit";
import stream from "stream";

export const generateBillPdfBuffer = async (bill) => {
  const doc = new PDFDocument({ margin: 36 });
  const chunks = [];
  const writable = new stream.Writable({
    write(chunk, enc, next) {
      chunks.push(chunk);
      next();
    },
  });

  doc.pipe(writable);

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Bill ID: ${bill.billId}`);
  doc.text(`Customer: ${bill.customerName}`);
  if (bill.customerPhone) doc.text(`Phone: ${bill.customerPhone}`);
  if (bill.customerEmail) doc.text(`Email: ${bill.customerEmail}`);
  doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.text("Items:");
  doc.moveDown(0.5);

  const tableHeader = ["Product", "Qty", "Price", "Tax", "Total"];
  doc.text(tableHeader.join("    "));
  doc.moveDown(0.5);

  bill.items.forEach((item) => {
    const taxAmount = (item.taxes || []).reduce((acc, t) => acc + (t.taxAmount || 0), 0);
    const line = [
      item.productName?.productName || "Unnamed",
      String(item.quantity),
      `₹${Number(item.price).toFixed(2)}`,
      `₹${Number(taxAmount).toFixed(2)}`,
      `₹${Number(item.total + taxAmount).toFixed(2)}`,
    ].join("    ");
    doc.text(line);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Grand Total: ₹${Number(bill.grandTotal).toFixed(2)}`, { align: "right" });

  doc.end();

  await new Promise((resolve) => writable.on("finish", resolve));
  return Buffer.concat(chunks);
};


