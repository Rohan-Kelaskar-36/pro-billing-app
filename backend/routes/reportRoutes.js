import express from "express";
import { getStoreReport, getAllStoreReports, getFashionInsights, getGlobalFashionInsights } from "../controllers/reportController.js";
import { protectAdmin,protectManager } from "../middleware/authMiddleware.js";

const router = express.Router();
// Route for manager (per store)
router.get("/store/:storeId",protectManager,  getStoreReport);

// Route for admin (all stores)
router.get("/all", getAllStoreReports);

// Fashion trend insights per-store (manager)
router.get("/store/:storeId/insights", protectManager, getFashionInsights);

// Global insights (no auth needed, but you can protect if desired)
router.get("/insights/global", getGlobalFashionInsights);

export default router;
