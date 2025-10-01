import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminInventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedStore, setSelectedStore] = useState("ALL");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("https://groovy-backend-km9g.onrender.com/api/inventory/");
        const grouped = groupByStore(res.data);
        setInventoryData(grouped);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  const groupByStore = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const storeId = item.store._id;
      if (!grouped[storeId]) {
        grouped[storeId] = {
          id: storeId,
          name: item.store.storeName,
          location: item.store.location,
          inventory: [],
        };
      }
      grouped[storeId].inventory.push({
        id: item.product._id,
name: item.product.productName?.productName || "Unnamed",
        quantity: item.quantity,
        threshold: item.threshold,
      });
    });
    return Object.values(grouped);
  };

  const filteredStores =
    selectedStore === "ALL"
      ? inventoryData
      : inventoryData.filter((s) => s.id === selectedStore);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Inventory Dashboard</h2>

      <div className="mb-6">
        <label className="font-medium mr-2">Filter by Store:</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ALL">All Stores</option>
          {inventoryData.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.location}
            </option>
          ))}
        </select>
      </div>

      {filteredStores.map((store) => (
        <div key={store.id} className="mb-8">
          <h3 className="text-xl font-semibold text-teal-700 mb-2">
            {store.name} ({store.location})
          </h3>
          <table className="w-full bg-white border rounded shadow mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {store.inventory.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
                    {item.quantity <= item.threshold ? (
                      <span className="text-red-600 font-semibold">Low Stock</span>
                    ) : (
                      <span className="text-green-600">Sufficient</span>
                    )}
                  </td>
                </tr>
              ))}
              {store.inventory.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No inventory in this store.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdminInventoryDashboard;
