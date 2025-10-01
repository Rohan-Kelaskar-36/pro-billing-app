import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin_token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set the cookie
    res.cookie("admin_token", admin_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true only in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});


    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin login failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
