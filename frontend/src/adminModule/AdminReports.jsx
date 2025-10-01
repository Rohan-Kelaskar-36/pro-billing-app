import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Warehouse,
  CalendarDays,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("https://groovy-backend-km9g.onrender.com/api/reports/all", {
          withCredentials: true, // include credentials if needed
        });
        setReports(response.data);
      } catch (err) {
        setError("Failed to fetch reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading reports...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Store-Wise Reports (All Stores)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((store) => (
          <div
            key={store.storeId}
            className="bg-white p-5 rounded-lg shadow border border-gray-200"
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-teal-700 flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-gray-500" />
                {store.storeName}
              </h3>
              <p className="text-gray-600">{store.location}</p>
              <p className="text-sm text-gray-500">Store ID: {store.storeId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Daily Sales */}
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  Daily Bills
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {store.dailySales?.toLocaleString() || 0}
                </p>
              </div>

              {/* Daily Revenue */}
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  Daily Revenue
                </p>
                <p className="text-lg font-bold text-green-600">
                  ₹{store.dailyRevenue?.toLocaleString() || 0}
                </p>
              </div>

              {/* Weekly Sales */}
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-500">Weekly Bills</p>
                <p className="text-lg font-bold text-blue-600">
                  {store.weeklySales?.toLocaleString() || 0}
                </p>
              </div>

              {/* Weekly Revenue */}
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-500">Weekly Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{store.weeklyRevenue?.toLocaleString() || 0}
                </p>
              </div>

              {/* Monthly Sales */}
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-gray-500">Monthly Bills</p>
                <p className="text-lg font-bold text-blue-600">
                  {store.monthlySales?.toLocaleString() || 0}
                </p>
              </div>

              {/* Monthly Revenue */}
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{store.monthlyRevenue?.toLocaleString() || 0}
                </p>
              </div>

              {/* GST Collected */}
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-sm text-gray-500">GST Collected</p>
                <p className="text-lg font-bold text-yellow-600">
                  ₹{store.gstCollected?.toLocaleString() || 0}
                </p>
              </div>

              {/* GST Pending */}
              <div className="bg-red-50 p-3 rounded">
                <p className="text-sm text-gray-500">GST Pending</p>
                <p className="text-lg font-bold text-red-500">
                  ₹{store.gstPending?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
