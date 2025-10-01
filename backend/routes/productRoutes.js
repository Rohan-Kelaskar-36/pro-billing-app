import express from "express";
import {
 addProduct,getProducts
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);         // POST /api/products
router.get("/", getProducts);





export default router;
