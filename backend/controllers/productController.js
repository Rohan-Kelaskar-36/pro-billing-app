import Product from "../models/productModel.js"; // adjust path if needed
import Inventory from "../models/inventoryModel.js";
import mongoose from "mongoose";


// @desc Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    .populate("productName") 
      .populate("category", "categoryName")
      .populate("size", "sizeName")
      .populate("color", "colorName");
  res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


export const addProduct = async (req, res) => {
  try {
    const { productName, category, size, color, price, stock, storeId, threshold } = req.body;

    if (!productName || !category || !size || !color || !price || !stock || !storeId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const parsedThreshold = threshold !== undefined ? Number(threshold) : 5;

    const productNameId = new mongoose.Types.ObjectId(productName);
    const categoryId = new mongoose.Types.ObjectId(category);
    const sizeId = new mongoose.Types.ObjectId(size);
    const colorId = new mongoose.Types.ObjectId(color);
    const storeObjectId = new mongoose.Types.ObjectId(storeId);

    // ✅ Check for existing product with same attributes
    let existingProduct = await Product.findOne({
      productName: productNameId,
      category: categoryId,
      size: sizeId,
      color: colorId,
    });

    if (existingProduct) {
      const existingInventory = await Inventory.findOne({
        store: storeObjectId,
        product: existingProduct._id,
        category: categoryId,
      });

      if (existingInventory) {
        existingProduct.stock += Number(stock);
        await existingProduct.save();

        existingInventory.quantity += Number(stock);
        existingInventory.lastUpdated = new Date();
        await existingInventory.save();

        return res.status(200).json({
          message: "Existing product updated and stock added",
          product: existingProduct,
        });
      } else {
        await Inventory.create({
          store: storeObjectId,
          product: existingProduct._id,
          category: categoryId,
          quantity: Number(stock),
          threshold: parsedThreshold,
        });

        return res.status(201).json({
          message: "Product exists, new inventory created",
          product: existingProduct,
        });
      }
    }

    // ❌ Product doesn't exist — create new
    const newProduct = await Product.create({
      productName: productNameId,
      category: categoryId,
      size: sizeId,
      color: colorId,
      price: Number(price),
      stock: Number(stock),
    });

    await Inventory.create({
      store: storeObjectId,
      product: newProduct._id,
      category: categoryId,
      quantity: Number(stock),
      threshold: parsedThreshold, // ✅ fixed here
    });

    return res.status(201).json({
      message: "New product and inventory created",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
