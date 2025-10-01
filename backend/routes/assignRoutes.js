import express from "express";
import { createUser, getAllUsers } from "../controllers/assignController.js";

const router = express.Router();

router.post("/create-user", createUser);    // POST /api/assign/create-user
router.get("/all-users", getAllUsers);      // GET /api/assign/all-users

export default router;
