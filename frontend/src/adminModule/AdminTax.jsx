import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminTax = () => {
  const [taxes, setTaxes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: "",
    isDefault: false,
    category: "",
  });

  // fetch categories and taxes
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, taxRes] = await Promise.all([
        axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/category"),
        axios.get("https://groovy-backend-km9g.onrender.com/api/tax/"),
      ]);
      setCategories(catRes.data || []);
      setTaxes(taxRes.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
      toast.error("⚠️ Failed to load data");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://groovy-backend-km9g.onrender.com/api/tax/", {
        ...formData,
      });

      setTaxes([...taxes, response.data]);
      toast.success("Tax added successfully!");

      setFormData({
        name: "",
        type: "percentage",
        value: "",
        isDefault: false,
        category: "",
      });
    } catch (error) {
      console.error("Failed to add tax", error);
      toast.error("Error adding tax!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax?")) return;
    try {
      await axios.delete(`https://groovy-backend-km9g.onrender.com/api/tax/taxes/${id}`);
      setTaxes(taxes.filter((tax) => tax._id !== id));
      toast.success("Tax deleted successfully!");
    } catch (error) {
      console.error("Failed to delete tax", error);
      toast.error("Error deleting tax");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Tax Configuration</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Tax Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <input
          type="number"
          name="value"
          placeholder="Value"
          value={formData.value}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          Default
        </label> */}

        <button
          type="submit"
          className="bg-teal-950 hover:bg-teal-900 text-white px-4 py-2 rounded col-span-full md:col-span-1"
        >
          Add Tax
        </button>
      </form>

      {/* Tax List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Value</th>
              <th className="py-2 px-4 text-left">Category</th>
              {/* <th className="py-2 px-4 text-left">Default</th> */}
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax._id || tax.name} className="border-t">
                <td className="py-2 px-4">{tax.name}</td>
                <td className="py-2 px-4 capitalize">{tax.type}</td>
                <td className="py-2 px-4">
                  {tax.value}
                  {tax.type === "percentage" ? "%" : " ₹"}
                </td>
                <td className="py-2 px-4">{tax.category?.categoryName}</td>
                {/* <td className="py-2 px-4">{tax.isDefault ? "✅" : "❌"}</td> */}
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(tax._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {taxes.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No tax rules added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTax;
