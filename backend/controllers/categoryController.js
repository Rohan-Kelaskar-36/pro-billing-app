import Category from "../models/categoryModel.js";
import Size from "../models/sizeModel.js";
import Color from "../models/colorModel.js";
import ProductName from "../models/productNameModel.js";

// =============== Product Name ===================

export const addProductName = async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) return res.status(400).json({ message: "Product name is required" });

    const exists = await ProductName.findOne({ productName });
    if (exists) return res.status(400).json({ message: "Product name already exists" });

    const newProductName = new ProductName({ productName });
    await newProductName.save();
    res.status(201).json({ message: "Product name added", productName: newProductName });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product name", error });
  }
};

export const getAllProductNames = async (req, res) => {
  try {
    const productNames = await ProductName.find().sort({ createdAt: -1 });
    res.json(productNames);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product names", error });
  }
};

export const deleteProductName = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductName.findByIdAndDelete(id);
    res.json({ message: "Product name deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product name", error });
  }
};
// =============== Category ===================

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ message: "Category name is required" });

    const exists = await Category.findOne({ categoryName });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ categoryName });
    await category.save();
    res.status(201).json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ message: "Failed to add category", error });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

// =============== Size ===================

export const addSize = async (req, res) => {
  try {
    const { sizeName } = req.body;
    if (!sizeName) return res.status(400).json({ message: "Size name is required" });

    const exists = await Size.findOne({ sizeName });
    if (exists) return res.status(400).json({ message: "Size already exists" });

    const size = new Size({ sizeName });
    await size.save();
    res.status(201).json({ message: "Size added", size });
  } catch (error) {
    res.status(500).json({ message: "Failed to add size", error });
  }
};

export const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find().sort({ createdAt: -1 });
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sizes", error });
  }
};

export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    await Size.findByIdAndDelete(id);
    res.json({ message: "Size deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete size", error });
  }
};

// =============== Color ===================

export const addColor = async (req, res) => {
  try {
    const { colorName } = req.body;
    if (!colorName) return res.status(400).json({ message: "Color name is required" });

    const exists = await Color.findOne({ colorName });
    if (exists) return res.status(400).json({ message: "Color already exists" });

    const color = new Color({ colorName });
    await color.save();
    res.status(201).json({ message: "Color added", color });
  } catch (error) {
    res.status(500).json({ message: "Failed to add color", error });
  }
};

export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ createdAt: -1 });
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch colors", error });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    await Color.findByIdAndDelete(id);
    res.json({ message: "Color deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete color", error });
  }
};





