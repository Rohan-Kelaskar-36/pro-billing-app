import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("https://groovy-backend-km9g.onrender.com/api/inventory/manager/", {
          withCredentials: true,
        });
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Store Inventory</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No inventory data available.</div>
        ) : (
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Size</th>
                <th className="py-2 px-4 text-left">Color</th>
                <th className="py-2 px-4 text-left">Price (₹)</th>
                <th className="py-2 px-4 text-left">Stock</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 px-4">
                    {item.product?.productName?.productName || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {item.category?.categoryName || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {item.product?.size?.sizeName || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {item.product?.color?.colorName || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    ₹{item.product?.price?.toFixed(2) || "N/A"}
                  </td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
  {item.threshold !== undefined && item.quantity <= item.threshold ? (
    <span className="text-red-600 font-semibold">Low Stock</span>
  ) : (
    <span className="text-green-600">Sufficient</span>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagerInventory;
