import express from "express";
import {
  getAllInventory,
  adjustStock,
  transferStock,
  getManagerInventory,
  searchInventory,
} from "../controllers/inventoryController.js";




import { protectCashierOrManager, protectCashier } from "../middleware/authMiddleware.js";

// Optionally add protect middleware if you want role-based protection
// import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Routes
router.get("/", getAllInventory);               // GET /api/inventory
router.post("/adjust", adjustStock);            // POST /api/inventory/adjust
router.post("/transfer", transferStock);        // POST /api/inventory/transfer

// Manager Route
router.get("/manager",protectCashierOrManager, getManagerInventory);    // GET /api/inventory/manager
// Cashier Route (non-global, similar pattern)
router.get("/cashier",protectCashier, getManagerInventory);             // GET /api/inventory/cashier
// Search Route
router.get("/search",protectCashier, searchInventory);                  // GET /api/inventory/search

export default router;
