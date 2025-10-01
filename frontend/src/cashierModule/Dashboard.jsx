import React from "react";

// Sample dashboard data (replace with backend data)
const dashboardData = {
  totalBillsToday: 42,
  totalItemsSold: 138,
  topProducts: [
    { name: "T-Shirt", sold: 38 },
    { name: "Sneakers", sold: 24 },
    { name: "Cap", sold: 19 },
  ],
};

const Dashboard = () => {
  const { totalBillsToday, totalItemsSold, topProducts } = dashboardData;

  return (
    <div className="px-4 py-6 lg:px-12">
      <h2 className="text-2xl font-semibold mb-6">Cashier Dashboard</h2>

      {/* Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-gray-600 text-sm mb-1">Total Bills Today</h3>
          <p className="text-2xl font-semibold text-blue-600">{totalBillsToday}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-gray-600 text-sm mb-1">Total Items Sold</h3>
          <p className="text-2xl font-semibold text-green-600">{totalItemsSold}</p>
        </div>
      </div>

      {/* Top Sold Products Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Top 3 Sold Products Today</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Product</th>
                <th className="px-4 py-2 text-left border">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
