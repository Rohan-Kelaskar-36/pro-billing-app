import express from "express";
import {
  addCategory,
  getAllCategories,
  deleteCategory,
  addSize,
  getAllSizes,
  deleteSize,
  addColor,
  getAllColors,
  deleteColor,addProductName,getAllProductNames,deleteProductName,
} from "../controllers/categoryController.js";

const router = express.Router();

// ======== Category Routes ========
router.post("/category", addCategory);
router.get("/category", getAllCategories);
router.delete("/category/:id", deleteCategory);

// ======== Size Routes ========
router.post("/size", addSize);
router.get("/size", getAllSizes);
router.delete("/size/:id", deleteSize);

// ======== Color Routes ========
router.post("/color", addColor);
router.get("/color", getAllColors);
router.delete("/color/:id", deleteColor);




router.post("/product-name", addProductName);
router.get("/product-name", getAllProductNames);
router.delete("/:id", deleteProductName);



export default router;
