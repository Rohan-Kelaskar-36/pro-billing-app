import React, { useState } from "react";

const AdjustStockModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adjustment || reason.trim() === "") return;
    onSubmit({ productId: product.id, adjustment, reason });
    setAdjustment(0);
    setReason("");
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Adjust Stock for: <span className="text-teal-700">{product.name}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Quantity (use negative for deduction)</label>
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(parseInt(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
