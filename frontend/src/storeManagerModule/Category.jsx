import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState("");

  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("");

  const [productNames, setProductNames] = useState([]);
  const [newProductName, setNewProductName] = useState("");

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [catRes, sizeRes, colorRes, productNameRes] = await Promise.all([
          axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/category"),
          axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/size"),
          axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/color"),
          axios.get("https://groovy-backend-km9g.onrender.com/api/attributes/product-name"),
        ]);
        setCategories(catRes.data);
        setSizes(sizeRes.data);
        setColors(colorRes.data);
        setProductNames(productNameRes.data);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      }
    };

    fetchAttributes();
  }, []);

  const addItem = async (type, value, setter, state) => {
    if (!value.trim()) return;

    try {
      const res = await axios.post(`https://groovy-backend-km9g.onrender.com/api/attributes/${type}`, {
        [`${type === "product-name" ? "productName" : type + "Name"}`]: value,
      });
      const newItem = res.data[type.replace("-", "")];
      setter([...state, newItem]);
    } catch (err) {
      console.error(`Failed to add ${type}:`, err);
    }
  };

  const deleteItem = async (type, id, setter, state) => {
    try {
      const endpoint =
        type === "product-name"
          ? `https://groovy-backend-km9g.onrender.com/api/attributes/${id}`
          : `https://groovy-backend-km9g.onrender.com/api/attributes/${type}/${id}`;

      await axios.delete(endpoint);
      setter(state.filter((item) => item._id !== id));
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
    }
  };

  const renderSection = (title, items, value, setValue, type, keyName, stateSetter, stateList) => (
    <div className="bg-white rounded shadow p-4 w-full sm:w-1/2 lg:w-1/3">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-center gap-2 mb-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Add ${title}`}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => addItem(type, value, stateSetter, stateList).then(() => setValue(""))}
          className="bg-teal-950 hover:bg-teal-900 text-white px-3 py-2 rounded transition"
        >
          Add
        </button>
      </div>
      <ul className="text-sm text-gray-700">
        {items.map((item, index) => {
  if (!item || !item._id) return null;
  return (
    <li key={item._id || index} className="flex justify-between items-center border-b py-1">
      {item[keyName]}
      <button
        onClick={() => deleteItem(type, item._id, stateSetter, stateList)}
        className="text-red-500 text-xs hover:underline"
      >
        Delete
      </button>
    </li>
  );
})}

        {items.length === 0 && <li className="text-gray-400">No entries</li>}
      </ul>
    </div>
  );

  return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6 text-center">Attribute Management</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {renderSection("Product Categories", categories, newCategory, setNewCategory, "category", "categoryName", setCategories, categories)}
      {renderSection("Product Sizes", sizes, newSize, setNewSize, "size", "sizeName", setSizes, sizes)}
      {renderSection("Product Colors", colors, newColor, setNewColor, "color", "colorName", setColors, colors)}
      {renderSection("Product Names", productNames, newProductName, setNewProductName, "product-name", "productName", setProductNames, productNames)}
    </div>
  </div>
);

};

export default Category;
