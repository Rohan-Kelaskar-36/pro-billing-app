import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

// Lucide Icons
import {
  ReceiptText,
  ShoppingCart,
  Wallet,
  Percent
} from "lucide-react";

function AdminDashBoard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [lowSoldProducts, setLowSoldProducts] = useState([]);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("https://groovy-backend-km9g.onrender.com/api/reports/all", {
          withCredentials: true,
        });
        setReports(response.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Aggregated values
  const totalBillsToday = reports.reduce((sum, store) => sum + (store.dailyBills || 0), 0);
  const totalItemsSold = reports.reduce((sum, store) => sum + (store.dailySales || 0), 0);
  const totalCashCollected = reports.reduce((sum, store) => sum + (store.dailyRevenue || 0), 0);
  const totalGSTCollected = reports.reduce((sum, store) => sum + (store.gstCollected || 0), 0);

  const productColumns = [
    { name: "Product Name", selector: row => row.name },
    { name: "Units Sold", selector: row => row.sold }
  ];

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="px-4 py-6 lg:px-12">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
       

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="text-green-600" />
            <h3 className="text-gray-600 text-sm">Total Bills</h3>
          </div>
          <p className="text-2xl font-semibold text-green-600">{totalItemsSold}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-yellow-600" />
            <h3 className="text-gray-600 text-sm">Total Cash Collected</h3>
          </div>
          <p className="text-2xl font-semibold text-yellow-600">₹{totalCashCollected.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center gap-3 mb-2">
            <Percent className="text-red-500" />
            <h3 className="text-gray-600 text-sm">Total Tax Collected</h3>
          </div>
          <p className="text-2xl font-semibold text-red-500">₹{totalGSTCollected.toLocaleString()}</p>
        </div>
      </div>

      {/* Optional Product Tables (Placeholder) */}
      {/* <DataTable columns={productColumns} data={topSellingProducts} /> */}
    </div>
  );
}

export default AdminDashBoard;
