import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BarChart2, TrendingUp, Calendar, AlertCircle } from "lucide-react";

const ManagerReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const storeId = Cookies.get("storeId");
      if (!storeId) {
        setError("Store ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://groovy-backend-km9g.onrender.com/api/reports/store/${storeId}`,
          { withCredentials: true }
        );
        setReport(res.data);
      } catch (err) {
        console.error("Failed to fetch report:", err);
        setError("Failed to load report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-48">
        <h2 className="text-lg text-gray-500 animate-pulse">Loading store report...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-48">
        <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </h2>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 flex items-center justify-center h-48">
        <h2 className="text-lg font-semibold text-red-600">No report data available.</h2>
      </div>
    );
  }

  const stats = [
    {
      label: "Daily Bills",
      value: report.dailySales,
      color: "text-blue-600",
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Weekly Bills",
      value: report.weeklySales,
      color: "text-blue-600",
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Monthly Bills",
      value: report.monthlySales,
      color: "text-blue-600",
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Daily Revenue",
      value: `₹${report.dailyRevenue.toLocaleString()}`,
      color: "text-green-600",
      icon: <BarChart2 className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Weekly Revenue",
      value: `₹${report.weeklyRevenue.toLocaleString()}`,
      color: "text-green-600",
      icon: <BarChart2 className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Monthly Revenue",
      value: `₹${report.monthlyRevenue.toLocaleString()}`,
      color: "text-green-600",
      icon: <BarChart2 className="w-5 h-5 text-green-400" />,
    },
    {
      label: "GST Collected",
      value: `₹${report.gstCollected.toLocaleString()}`,
      color: "text-orange-600",
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "GST Pending",
      value: `₹${report.gstPending.toLocaleString()}`,
      color: "text-red-600",
      icon: <Calendar className="w-5 h-5 text-red-400" />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">📊 Store Performance Report</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl p-5 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div>{item.icon}</div>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
            <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerReports;
