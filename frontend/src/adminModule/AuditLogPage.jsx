import React from "react";

const dummyAuditLogs = [
  {
    id: 1,
    type: "Adjustment",
    product: "Toothpaste",
    store: "Store A",
    quantity: -5,
    reason: "Damaged packaging",
    performedBy: "Admin1",
    timestamp: "2025-07-28 10:15 AM",
  },
  {
    id: 2,
    type: "Transfer",
    product: "Soap",
    fromStore: "Store B",
    toStore: "Store A",
    quantity: 20,
    performedBy: "Admin2",
    timestamp: "2025-07-28 12:45 PM",
  },
  {
    id: 3,
    type: "Adjustment",
    product: "Milk",
    store: "Store B",
    quantity: 10,
    reason: "Inventory mismatch",
    performedBy: "Admin1",
    timestamp: "2025-07-29 09:30 AM",
  },
];

const AuditLogPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Inventory Audit Logs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Store(s)</th>
              <th className="py-2 px-4 text-left">Qty</th>
              <th className="py-2 px-4 text-left">Reason</th>
              <th className="py-2 px-4 text-left">By</th>
              <th className="py-2 px-4 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {dummyAuditLogs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="py-2 px-4">{log.type}</td>
                <td className="py-2 px-4">{log.product}</td>
                <td className="py-2 px-4">
                  {log.type === "Transfer"
                    ? `${log.fromStore} → ${log.toStore}`
                    : log.store}
                </td>
                <td
                  className={`py-2 px-4 font-medium ${
                    log.quantity < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {log.quantity > 0 ? "+" : ""}
                  {log.quantity}
                </td>
                <td className="py-2 px-4">{log.reason || "-"}</td>
                <td className="py-2 px-4">{log.performedBy}</td>
                <td className="py-2 px-4 text-sm text-gray-500">{log.timestamp}</td>
              </tr>
            ))}
            {dummyAuditLogs.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;
