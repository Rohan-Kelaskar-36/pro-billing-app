import React, { useState } from "react";

const TransferStockModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  stores = [] 
}) => {
  const [fromStore, setFromStore] = useState("");
  const [toStore, setToStore] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);

  const resetForm = () => {
    setFromStore("");
    setToStore("");
    setProductId("");
    setQuantity(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromStore || !toStore || !productId || quantity <= 0) return;
    onSubmit({ fromStore, toStore, productId, quantity });
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const fromInventory = stores.find((s) => s.id === fromStore)?.inventory || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-teal-700">Transfer Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">From Store</label>
            <select
              className="w-full border p-2 rounded"
              value={fromStore}
              onChange={(e) => {
                setFromStore(e.target.value);
                setProductId("");
              }}
              required
            >
              <option value="">Select Store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">To Store</label>
            <select
              className="w-full border p-2 rounded"
              value={toStore}
              onChange={(e) => setToStore(e.target.value)}
              required
            >
              <option value="">Select Store</option>
              {stores
                .filter((s) => s.id !== fromStore)
                .map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.location})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Product</label>
            <select
              className="w-full border p-2 rounded"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {fromInventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stock: {item.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferStockModal;
