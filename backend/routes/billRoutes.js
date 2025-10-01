import express from "express";
import { createBill,getBillsByStore, sendBillEmail } from "../controllers/billController.js";
import { protectCashier,  } from "../middleware/authMiddleware.js";


const router = express.Router();

// POST /api/bills
router.post("/checkout", protectCashier, createBill);
router.get("/store/:storeId", protectCashier, getBillsByStore);
router.post("/:billId/send-email", protectCashier, sendBillEmail);

export default router;
