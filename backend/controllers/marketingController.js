import Bill from "../models/billModel.js";
import mongoose from "mongoose";
import { sendEmailWithAttachment } from "../utils/emailService.js";

// GET /api/marketing/events
// Protected (Cashier)
export const getUpcomingEvents = async (req, res) => {
  try {
    console.log("[promotions] getUpcomingEvents called", {
      userId: req.user?._id?.toString?.(),
      role: req.user?.role,
      storeId: req.user?.storeId?._id || req.user?.storeId,
      origin: req.headers?.origin,
      referer: req.headers?.referer,
    });
    const apiKey = process.env.GEMINI_API_KEY_2;
    if (!apiKey) {
      console.warn("[promotions] Missing GEMINI_API_KEY_2 env");
      return res.status(500).json({ message: "GEMINI_API_KEY_2 not configured" });
    }

    const today = new Date().toISOString().split("T")[0];

    const prompt = `
You are a helpful assistant for a retail cashier in India.
Today is ${today}. List the next 8 notable upcoming Indian government holidays, national festivals, and widely observed events within the next 60 days. 
Return only a compact JSON array with objects of shape:
[{ "name": string, "date": "YYYY-MM-DD", "type": "Holiday|Festival|Event", "note": string }]
No extra text, only valid JSON.
`;

    // Use v1beta endpoint and valid public model aliases
    const modelCandidates = [
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];

    const base = "https://generativelanguage.googleapis.com/v1beta/models";
    const makeUrl = (model) => `${base}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    };

    let response;
    let lastErrText = "";
    for (const model of modelCandidates) {
      response = await fetch(makeUrl(model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) break;
      lastErrText = await response.text().catch(() => "");
      console.warn("[promotions] Gemini model failed", {
        model,
        status: response.status,
        statusText: response.statusText,
        lastErrText: lastErrText?.slice?.(0, 300),
      });
    }

    if (!response || !response.ok) {
      console.error("[promotions] All Gemini model attempts failed, serving fallback");
      const fallback = [
        { name: "Dussehra", date: "2025-10-02", type: "Festival", note: "Major Hindu festival" },
        { name: "Diwali", date: "2025-10-20", type: "Festival", note: "Festival of Lights" },
        { name: "Guru Nanak Jayanti", date: "2025-11-05", type: "Festival", note: "Sikh festival" },
        { name: "Christmas", date: "2025-12-25", type: "Holiday", note: "Public holiday" },
      ];
      return res.status(200).json({ events: fallback, fallback: true });
    }

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let events = [];
    try {
      events = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      events = match ? JSON.parse(match[0]) : [];
    }
    if (!Array.isArray(events) || events.length === 0) {
      console.warn("[promotions] Parsed events empty", { raw: text?.slice?.(0, 300) });
    } else {
      console.log("[promotions] Events fetched", { count: events.length });
    }

    return res.json({ events });
  } catch (err) {
    console.error("[promotions] getUpcomingEvents error:", err?.message, err?.stack);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// POST /api/marketing/campaign
// Protected (Cashier)
// body: { storeId: string, eventName: string, discountPercent: number }
export const sendCampaign = async (req, res) => {
  try {
    const { storeId, eventName, discountPercent } = req.body || {};
    console.log("[promotions] sendCampaign called", {
      userId: req.user?._id?.toString?.(),
      role: req.user?.role,
      storeId,
      eventName,
      discountPercent,
    });
    if (!storeId || !eventName || discountPercent == null) {
      return res
        .status(400)
        .json({ message: "storeId, eventName, discountPercent required" });
    }

    // Bill schema uses `store` (ObjectId), not `storeId`
    const fromUserStore = req.user?.storeId?._id || req.user?.storeId;
    const resolvedStore = storeId || fromUserStore;
    const asObjectId = (() => {
      try {
        return new mongoose.Types.ObjectId(resolvedStore);
      } catch {
        return resolvedStore;
      }
    })();

    const bills = await Bill.find({
      $and: [
        { customerEmail: { $exists: true, $ne: "" } },
        { $or: [ { store: asObjectId }, { storeId: asObjectId } ] }, // support legacy/storeId
      ],
    })
      .select("customerName customerEmail")
      .lean();
    console.log("[promotions] bills with emails", { count: bills?.length || 0 });

    const uniqueMap = new Map();
    for (const b of bills) {
      const email = (b.customerEmail || "").trim().toLowerCase();
      if (!email) continue;
      if (!uniqueMap.has(email)) {
        uniqueMap.set(email, { name: b.customerName || "Customer", email });
      }
    }
    const recipients = Array.from(uniqueMap.values());
    if (recipients.length === 0) {
      return res
        .status(200)
        .json({ message: "No prior customers with email found", sent: 0 });
    }

    const makeHtml = (username) => `
<div style="font-family: Arial, sans-serif; background:#f7f7fb; padding:24px;">
  <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#6d5efc,#8a7dff); color:#fff; padding:24px 28px;">
      <h1 style="margin:0; font-size:22px; letter-spacing:0.3px;">Special Celebration Offer</h1>
      <p style="margin:6px 0 0; opacity:0.95;">Exclusive for our valued customers</p>
    </div>
    <div style="padding:28px;">
      <p style="font-size:16px; color:#333; line-height:1.6;">
        <strong>Welcome ${username}</strong>,
      </p>
      <p style="font-size:16px; color:#333; line-height:1.6;">
        On the occasion of <strong>${eventName}</strong>, our previous buyers will get 
        <span style="background:#fff5cc; padding:2px 6px; border-radius:6px; font-weight:600;">${discountPercent}% OFF</span> 
        on every item!
      </p>
      <div style="margin:18px 0; padding:16px; background:#f0f4ff; border:1px dashed #a7b5ff; border-radius:10px;">
        <p style="margin:0; color:#334; font-size:15px;">
          Come and visit your nearest stores to enjoy this offer.
        </p>
      </div>
      <div style="margin-top:22px;">
        <a href="#" style="display:inline-block; background:#6d5efc; color:#fff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600;">
          Shop Now
        </a>
      </div>
      <p style="font-size:12px; color:#777; margin-top:28px;">
        If you have any questions, just reply to this email—we’re happy to help.
      </p>
    </div>
    <div style="background:#fbfbfd; color:#777; padding:14px 20px; font-size:12px; text-align:center;">
      © ${new Date().getFullYear()} Your Store. All rights reserved.
    </div>
  </div>
</div>`;

    let sent = 0;
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      console.log("[promotions] sending batch", { start: i, size: batch.length });
      await Promise.all(
        batch.map(({ name, email }) =>
          sendEmailWithAttachment({
            to: email,
            subject: `${eventName} Celebration — ${discountPercent}% OFF for our valued buyers`,
            text: `Welcome ${name}, On the occasion of ${eventName}, our previous buyers will get ${discountPercent}% discount on every item. Come and visit your nearest stores.`,
            html: makeHtml(name),
          })
            .then(() => {
              sent += 1;
            })
            .catch((err) => {
              console.error("[promotions] Failed to send to", email, err?.message);
            })
        )
      );
    }

    console.log("[promotions] sendCampaign done", { sent, totalRecipients: recipients.length });
    return res.json({ message: "Campaign processed", sent, totalRecipients: recipients.length });
  } catch (err) {
    console.error("[promotions] sendCampaign error:", err?.message, err?.stack);
    res.status(500).json({ message: "Failed to send campaign" });
  }
};


