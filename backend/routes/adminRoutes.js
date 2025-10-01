import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";



const router = express.Router();

router.post("/login", adminLogin);



// routes/adminRoutes.js  (or add to authRoutes.js)



// GET /api/admin/check-auth
router.get("/check-auth", async (req, res) => {
  try {
    const token = req.cookies?.admin_token;
    if (!token) {
      return res.status(401).json({ authenticated: false, message: "No token" });
    }

    // verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }

    // optional: fetch admin details
    const admin = await Admin.findById(payload.adminId).select("_id name email");
    if (!admin) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error("check-auth error:", err);
    return res.status(500).json({ authenticated: false, message: "Server error" });
  }
});






export default router;
