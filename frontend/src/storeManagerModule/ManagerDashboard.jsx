import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FileText,
  Wallet,
  Percent,
} from "lucide-react"; // Importing Lucide Icons

const ManagerDashboard = () => {
  const [report, setReport] = useState(null);
  const [managerName, setManagerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storeId = Cookies.get("storeId");
      if (!storeId) {
        setError("Store ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const reportRes = await axios.get(
          `https://groovy-backend-km9g.onrender.com/api/reports/store/${storeId}`,
          { withCredentials: true }
        );
        setReport(reportRes.data);

        const profileRes = await axios.get(
          "https://groovy-backend-km9g.onrender.com/api/auth/manager/profile",
          { withCredentials: true }
        );
        setManagerName(profileRes.data.name || "Manager");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load manager dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500 text-lg">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  if (!report) {
    return <div className="p-8 text-red-600 font-semibold">No report data found.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome, <span className="text-blue-600">{managerName}</span>!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Bills Today"
          value={report.dailySales}
          color="blue"
          Icon={FileText}
        />
        <Card
          title="Cash Collected Today"
          value={`₹${report.dailyRevenue.toLocaleString()}`}
          color="green"
          Icon={Wallet}
        />
        <Card
          title="GST Collected"
          value={`₹${report.gstCollected.toLocaleString()}`}
          color="orange"
          Icon={Percent}
        />
      </div>
    </div>
  );
};

const Card = ({ title, value, color, Icon }) => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className={`w-6 h-6 ${colorMap[color]}`} />
      </div>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
};

export default ManagerDashboard;
