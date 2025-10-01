import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";





const ManagerProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [productNames, setProductNames] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    size: "",
    color: "",
    price: "",
    stock: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/category").then((res) => setCategories(res.data));
    axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/size").then((res) => setSizes(res.data));
    axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/color").then((res) => setColors(res.data));
    axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/product-name").then((res) => setProductNames(res.data));
    axios.get("https://groovy-backend-km9g.onrender.com/api/products").then((res) => setProducts(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const storeId = Cookies.get("storeId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { productName, category, size, color, price, stock } = formData;

    if (!productName || !category || !size || !color || !price || !stock || !storeId) {
toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post("https://groovy-backend-km9g.onrender.com/api/products/", {
        productName,
        category,
        size,
        color,
        price: Number(price),
        stock: Number(stock),
        storeId,
      });

      setProducts([...products, response.data.product]);

      setFormData({
        productName: "",
        category: "",
        size: "",
        color: "",
        price: "",
        stock: "",
      });

      toast.success("Product added successfully.");
    } catch (error) {
      console.error("Failed to add product:", error.response?.data || error.message);
      toast.error("Error adding product.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 bg-white p-6 rounded-xl shadow"
      >
        <select
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-2 border p-2 rounded text-black"
        >
          <option value="">Select Product Name</option>
          {productNames.map((p) => (
            <option key={p._id} value={p._id}>
              {p.productName}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-1 border p-2 rounded text-black"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-1 border p-2 rounded text-black"
        >
          <option value="">Select Size</option>
          {sizes.map((size) => (
            <option key={size._id} value={size._id}>
              {size.sizeName}
            </option>
          ))}
        </select>

        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-1 border p-2 rounded text-black"
        >
          <option value="">Select Color</option>
          {colors.map((color) => (
            <option key={color._id} value={color._id}>
              {color.colorName}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-1 border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="col-span-full md:col-span-1 border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-teal-950 hover:bg-teal-900 text-white font-semibold rounded px-4 py-2 col-span-full md:col-span-1"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Product Table */}
      {/* <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Color</th>
              <th className="py-3 px-4">Price (₹)</th>
              <th className="py-3 px-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id || product.id} className="border-t">
                <td className="py-2 px-4">{product.productName?.productName || "-"}</td>
                <td className="py-2 px-4">{product.category?.categoryName || "-"}</td>
                <td className="py-2 px-4">{product.size?.sizeName || "-"}</td>
                <td className="py-2 px-4">{product.color?.colorName || "-"}</td>
                <td className="py-2 px-4">₹{product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default ManagerProductManager;
