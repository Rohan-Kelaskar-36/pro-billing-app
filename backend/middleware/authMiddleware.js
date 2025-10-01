 import jwt from "jsonwebtoken";
import Cashier from "../models/cashierModel.js";
import Manager from "../models/managerModel.js";
import Admin from "../models/adminModel.js";




export const protectCashierOrManager = async (req, res, next) => {
  let token;

  // ✅ Try Bearer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // ✅ Try cookies
  else if (req.cookies?.cashier_token) {
    token = req.cookies.cashier_token;
  } else if (req.cookies?.manager_token) {
    token = req.cookies.manager_token;
  }

  // ❌ No token at all
  if (!token) {
    console.warn("[auth] No token for", req.method, req.originalUrl, {
      hasAuthHeader: Boolean(req.headers.authorization),
      cookieKeys: Object.keys(req.cookies || {}),
    });
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[auth] Decoded token role:", decoded?.role, "user:", decoded?.id);

    if (decoded.role === "Cashier") {
      const cashier = await Cashier.findById(decoded.id)
        .select("-password")
        .populate("storeId");

      if (!cashier) {
        console.warn("[auth] Cashier not found for id", decoded.id);
        return res.status(401).json({ message: "Cashier not found" });
      }

      req.user = cashier;
      req.user.role = "Cashier";
      return next();
    }

    if (decoded.role === "Manager") {
      const manager = await Manager.findById(decoded.id)
        .select("-password")
        .populate("storeId");

      if (!manager) {
        console.warn("[auth] Manager not found for id", decoded.id);
        return res.status(401).json({ message: "Manager not found" });
      }

      req.user = manager;
      req.user.role = "Manager";
      return next();
    }

    // ❌ Any other role (e.g. Admin)
    console.warn("[auth] Access denied for role", decoded?.role);
    return res.status(403).json({ message: "Access denied: Unauthorized role" });
  } catch (err) {
    console.error("[auth] JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};










// Protect Cashier Route
export const protectCashier = async (req, res, next) => {
  let token;

  // ✅ Get token from Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ If not in header, try cookie
  else if (req.cookies?.cashier_token) {
    token = req.cookies.cashier_token;
  }

  // ❌ No token found
  if (!token) {
    console.warn("[auth] No cashier token for", req.method, req.originalUrl, {
      hasAuthHeader: Boolean(req.headers.authorization),
      cookieKeys: Object.keys(req.cookies || {}),
    });
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[auth] Decoded cashier token role:", decoded?.role, "user:", decoded?.id);

    // ✅ Check for correct role
    if (decoded.role !== "Cashier") {
      console.warn("[auth] Access denied: role is not Cashier:", decoded?.role);
      return res
        .status(403)
        .json({ message: "Access denied: cashier  only" });
    }

    // ✅ Fetch manager from DB
    const cashier = await Cashier.findById(decoded.id)
      .select("-password")
      .populate("storeId");

    if (!cashier) {
      console.warn("[auth] Cashier not found for id", decoded.id);
      return res.status(401).json({ message: "Cashier not found" });
    }

    req.user = cashier; // Attach to request
    next();
  } catch (error) {
    console.error("[auth] JWT verify error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protect Manager Route



    // ✅ Then check Cookies
   export const protectManager = async (req, res, next) => {
  let token;

  // ✅ Get token from Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ If not in header, try cookie
  else if (req.cookies?.manager_token) {
    token = req.cookies.manager_token;
  }

  // ❌ No token found
  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // ✅ Check for correct role
    if (decoded.role !== "Manager") {
      return res
        .status(403)
        .json({ message: "Access denied: Managers only" });
    }

    // ✅ Fetch manager from DB
    const manager = await Manager.findById(decoded.id)
      .select("-password")
      .populate("storeId");

    if (!manager) {
      return res.status(401).json({ message: "Manager not found" });
    }

    req.user = manager; // Attach to request
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protect Admin Route
export const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
