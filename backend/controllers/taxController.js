// controllers/taxController.js

import Tax from "../models/taxModel.js";
import Category from "../models/categoryModel.js";

// POST /api/taxes
export const addTax = async (req, res) => {
  try {
    const { name, type, value, isDefault, category } = req.body;

    if (!name || !type || !value || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newTax = new Tax({
      name,
      type,
      value,
      isDefault: isDefault || false,
      isActive: true,
      category,
    });

    await newTax.save();

    const populatedTax = await Tax.findById(newTax._id).populate("category", "categoryName");

    res.status(201).json(populatedTax);
  } catch (err) {
    console.error("Tax creation failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/taxes
export const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().populate("category", "categoryName");
    res.status(200).json(taxes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching taxes" });
  }
};

// GET /api/taxes/category/:categoryId
export const getTaxByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const taxes = await Tax.find({ category: categoryId, isActive: true });
    res.status(200).json(taxes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tax for category" });
  }
};



// DELETE /api/taxes/:id
// DELETE /api/taxes/:id
export const deleteTax = async (req, res) => {
  try {
    const { id } = req.params;
console.log("Trying to delete Tax with id:", id);

    const tax = await Tax.findById(id);
   if (!tax) {
  console.log("No tax found in DB for id:", id);
  return res.status(404).json({ message: "Tax not found" });
}

    await tax.deleteOne();

    console.log(`Tax with ID ${id} deleted successfully.`);

    res.status(200).json({ message: "Tax deleted successfully" });
  } catch (err) {
    console.error("Tax deletion failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
