import express from "express";
import { protectCashier } from "../middleware/authMiddleware.js";
import { getUpcomingEvents, sendCampaign } from "../controllers/marketingController.js";

const router = express.Router();

// Debug logging for marketing routes to trace 401s without leaking secrets
router.use((req, res, next) => {
  try {
    const hasAuthHeader = Boolean(req.headers.authorization);
    const cookieKeys = Object.keys(req.cookies || {});
    console.log("[marketing]", req.method, req.originalUrl, {
      hasAuthHeader,
      cookieKeys,
      origin: req.headers.origin,
      referer: req.headers.referer,
    });
  } catch (e) {
    console.log("[marketing] log error", e?.message);
  }
  next();
});

router.get("/events", protectCashier, getUpcomingEvents);
router.post("/campaign", protectCashier, sendCampaign);

export default router;


