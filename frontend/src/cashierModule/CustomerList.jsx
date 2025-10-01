import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      const storeId = Cookies.get("cashier_storeId");
      if (!storeId) {
        setError("Store ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bills/store/${storeId}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const bills = res.data.bills || [];
        const customerMap = new Map();

        bills.forEach((bill) => {
          const { customerName, customerPhone, customerEmail, totalAmount } = bill;
          if (customerName && customerPhone) {
            const key = `${customerName}-${customerPhone}-${customerEmail || ""}`;
            if (!customerMap.has(key)) {
              customerMap.set(key, {
                name: customerName,
                phone: customerPhone,
                email: customerEmail || "",
                totalSpent: Number(totalAmount) || 0,
                visits: 1,
              });
            } else {
              const existing = customerMap.get(key);
              existing.totalSpent += Number(totalAmount) || 0;
              existing.visits += 1;
              customerMap.set(key, existing);
            }
          }
        });

        setCustomers(Array.from(customerMap.values()));
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Customer List</h2>

      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{cust.name}</td>
                <td className="border px-4 py-2">{cust.phone}</td>
                <td className="border px-4 py-2">{cust.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
