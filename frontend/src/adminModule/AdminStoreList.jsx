import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminStoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("https://groovy-backend-km9g.onrender.com/api/stores/");
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin - Store List</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading store data...</p>
        ) : (
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Store ID</th>
                <th className="py-2 px-4 text-left">Store Name</th>
                <th className="py-2 px-4 text-left">Location</th>
                <th className="py-2 px-4 text-left">Manager</th>
                <th className="py-2 px-4 text-left">Cashier</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store._id} className="border-t">
                  <td className="py-2 px-4">{store.storeId}</td>
                  <td className="py-2 px-4">{store.storeName}</td>
                  <td className="py-2 px-4">{store.location}</td>
                  <td className="py-2 px-4">
                    {store.manager?.name || "N/A"} <br />
                    <span className="text-sm text-gray-500">
                      {store.manager?.email || ""}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {store.cashier?.name || "N/A"} <br />
                    <span className="text-sm text-gray-500">
                      {store.cashier?.email || ""}
                    </span>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No stores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStoreList;
