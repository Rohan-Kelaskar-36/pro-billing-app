import express from "express";
import { loginManager, loginCashier,getCashierProfile,getManagerProfile } from "../controllers/authController.js";
import { protectCashier,protectManager } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/manager/login", loginManager);
router.post("/cashier/login", loginCashier);
router.get("/cashier/profile", protectCashier, getCashierProfile);
router.get("/manager/profile", protectManager, getManagerProfile);





export default router;
