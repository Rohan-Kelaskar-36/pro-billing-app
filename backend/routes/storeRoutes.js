import express from "express";
import {
  createStore,
  getStores,
  assignCashier,
  assignManager,
  deleteUser,
} from "../controllers/storeController.js";

const router = express.Router();

router.post("/create", createStore);
router.get("/", getStores);
router.put("/assign-cashier", assignCashier);
router.put("/assign-manager", assignManager);
router.delete("/delete/:role/:userId", deleteUser);



export default router;
