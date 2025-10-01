import Bill from "../models/billModel.js";
import Store from "../models/storeModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Helper function for making resilient API calls with retry logic
const makeApiCall = async (url, options, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      console.error(`API call attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Utility for date ranges
const getDateRange = (daysAgo) => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(now.getDate() - daysAgo);
  return { from, to: now };
};

// Helper function to aggregate sales
const aggregateSales = async (filter) => {
  return await Bill.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        billCount: { $sum: 1 },
gstCollected: { $sum: "$taxAmount" }
      },
    },
  ]);
};

// Manager-level store report
export const getStoreReport = async (req, res) => {
  try {
    const { storeId } = req.params;

    const { from: dailyFrom, to } = getDateRange(1);
    const { from: weeklyFrom } = getDateRange(7);
    const { from: monthlyFrom } = getDateRange(30);

    const [daily, weekly, monthly] = await Promise.all([
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: dailyFrom, $lte: to } }),
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: weeklyFrom, $lte: to } }),
      aggregateSales({ store: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: monthlyFrom, $lte: to } }),
    ]);

    res.json({
      storeId,
      dailySales: daily[0]?.billCount || 0,
      dailyRevenue: daily[0]?.totalSales || 0,
      weeklySales: weekly[0]?.billCount || 0,
      weeklyRevenue: weekly[0]?.totalSales || 0,
      monthlySales: monthly[0]?.billCount || 0,
      monthlyRevenue: monthly[0]?.totalSales || 0,
      gstCollected: monthly[0]?.gstCollected || 0,
      gstPending: Math.floor((monthly[0]?.gstCollected || 0) * 0.2), // Simulated 20% pending
    });
  } catch (err) {
    console.error("Store report error:", err);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};

// Admin-level all-store report
export const getAllStoreReports = async (req, res) => {
  try {
    const stores = await Store.find();
    console.log("Stores found:", stores.length);

    const reportPromises = stores.map((store) =>
  getStoreSummary(store._id).then((report) => ({
    ...report,
    storeId: store.storeId, // custom store ID (e.g. "SR1")
    storeName: store.storeName,
    location: store.location,
  }))
);

    const reports = await Promise.all(reportPromises);
    res.json(reports);
  } catch (err) {
    console.error("All store report error:", err);
    res.status(500).json({ message: "Failed to fetch all reports" });
  }
};


const getStoreSummary = async (storeId) => {
  const validObjectId = storeId;

  console.log("Processing store ID:", storeId);

  if (!validObjectId) throw new Error(`Invalid ObjectId for store: ${storeId}`);

  const { from: dailyFrom, to } = getDateRange(1);
  const { from: weeklyFrom } = getDateRange(7);
  const { from: monthlyFrom } = getDateRange(30);

  const [daily, weekly, monthly] = await Promise.all([
    aggregateSales({ store: validObjectId, createdAt: { $gte: dailyFrom, $lte: to } }),
    aggregateSales({ store: validObjectId, createdAt: { $gte: weeklyFrom, $lte: to } }),
    aggregateSales({ store: validObjectId, createdAt: { $gte: monthlyFrom, $lte: to } }),
  ]);

  return {
    dailySales: daily[0]?.billCount || 0,
    dailyRevenue: daily[0]?.totalSales || 0,
    weeklySales: weekly[0]?.billCount || 0,
    weeklyRevenue: weekly[0]?.totalSales || 0,
    monthlySales: monthly[0]?.billCount || 0,
    monthlyRevenue: monthly[0]?.totalSales || 0,
    gstCollected: monthly[0]?.gstCollected || 0,
    gstPending: Math.floor((monthly[0]?.gstCollected || 0) * 0.2),
  };
};

// ========== Fashion Trend Insights (Gemini) ==========
export const getFashionInsights = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { question } = req.query; // free-form question (optional)

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2;
    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    // Pull recent period sales (last 90 days) for more robust trends
    const since = new Date();
    since.setDate(since.getDate() - 90);

    const bills = await Bill.find({
      store: new mongoose.Types.ObjectId(storeId),
      createdAt: { $gte: since },
    })
      .select("items customerName customerPhone customerEmail totalAmount createdAt")
      .lean();

    // Build a compact sales summary for LLM (limit volume)
    const items = [];
    for (const bill of bills) {
      for (const it of bill.items) {
        items.push({
          productName: it.productName,
          quantity: it.quantity,
          price: it.price,
          total: it.total,
        });
      }
    }

    // Aggregate by productName to reduce token size
    const aggregateMap = new Map();
    for (const it of items) {
      const key = it.productName || "Unknown";
      const prev = aggregateMap.get(key) || { productName: key, units: 0, revenue: 0 };
      prev.units += it.quantity || 0;
      prev.revenue += it.total || 0;
      aggregateMap.set(key, prev);
    }
    const topSummary = Array.from(aggregateMap.values())
      .sort((a, b) => b.units - a.units)
      .slice(0, 100); // cap size

    // Prompt: must answer even if approximate
    const userQuestion = question?.trim();
    const baseGoal = userQuestion || "Provide overall fashion trend insights for this store based on recent sales.";
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `Using ONLY the store sales summary below, answer the user's question as specifically as possible. If the exact answer is not derivable (e.g., date or brand not in summary), provide the CLOSEST POSSIBLE estimate from the available data and clearly label it as \"approximate\". Never refuse; always answer with your best available store-based insight.

Store ID: ${storeId}
Data window in summary: last 90 days (as of ${today})

Sales summary (aggregated by productName):
${JSON.stringify(topSummary)}

User question:
${baseGoal}

Answer format:
- Short, direct bullets or a numbered list
- If estimating, include a brief note like \"approximate based on last 90 days\"`;

    // Call Gemini via v1beta endpoint; try valid aliases
    const modelCandidates = [
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];
    const base = "https://generativelanguage.googleapis.com/v1beta/models";
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.25,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    };

    let resp;
    let lastErrText = "";
    for (const model of modelCandidates) {
      const url = `${base}/${model}:generateContent?key=${apiKey}`;
      resp = await makeApiCall(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (resp.ok) break;
      lastErrText = await resp.text().catch(() => "");
    }

    if (!resp.ok) {
      console.error("Gemini error:", lastErrText);
      // Graceful fallback so UI continues to work
      const fallback = "Approximate insights based on sales summary: Focus on replenishing top-selling product names, bundle complementary items, and promote 10-15% discounts on slower movers. (AI service temporarily unavailable)";
      return res.status(200).json({ insights: fallback, fallback: true });
    }

    const data = await resp.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights generated.";

    return res.json({ insights: textOutput });
  } catch (err) {
    console.error("Fashion insights error:", err);
    
    // Provide fallback insights based on available data
    const fallbackInsights = `Based on recent sales data for store ${storeId}:
• Top performing products from the last 90 days
• Sales trends and customer preferences
• Inventory recommendations based on historical data
• Note: AI insights temporarily unavailable due to network issues`;
    
    return res.status(200).json({ 
      insights: fallbackInsights,
      fallback: true,
      message: "Using fallback insights due to API connectivity issues"
    });
  }
};

// Global (non-store) fashion insights via Gemini
export const getGlobalFashionInsights = async (req, res) => {
  try {
    const { question } = req.query; // optional free-form question

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2;
    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    const userQuestion = (question || "Global fashion insights (concise).").trim();
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `Answer the user's question about fashion directly. If the timeframe is current/future or data is uncertain, infer the most likely answer from widely recognized global patterns up to ${today}, and clearly label it as "approximate". Do not refuse; never say you don't have access. Keep it concise (<= 8 items or <= 10 bullets). Avoid generic templates.

User question:\n${userQuestion}`;

    const modelCandidates = [
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];
    const base = "https://generativelanguage.googleapis.com/v1beta/models";
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    };

    let resp;
    let lastErrText = "";
    for (const model of modelCandidates) {
      const url = `${base}/${model}:generateContent?key=${apiKey}`;
      resp = await makeApiCall(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (resp.ok) break;
      lastErrText = await resp.text().catch(() => "");
    }

    if (!resp.ok) {
      console.error("Gemini error:", lastErrText);
      const fallbackInsights = `Global Fashion Trends (Fallback Data):\n• Sustainable fashion continues to gain momentum\n• Comfort-focused styles remain popular post-pandemic\n• Digital-first shopping experiences are the new norm\n• Seasonal color trends vary by region and demographics\n• Note: AI insights temporarily unavailable`;
      return res.status(200).json({ insights: fallbackInsights, fallback: true });
    }

    const data = await resp.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights generated.";
    return res.json({ insights: textOutput });
  } catch (err) {
    console.error("Global fashion insights error:", err);
    
    // Provide fallback global insights
    const fallbackInsights = `Global Fashion Trends (Fallback Data):
• Sustainable fashion continues to gain momentum
• Comfort-focused styles remain popular post-pandemic
• Digital-first shopping experiences are the new norm
• Seasonal color trends vary by region and demographics
• Note: AI insights temporarily unavailable due to network issues`;
    
    return res.status(200).json({ 
      insights: fallbackInsights,
      fallback: true,
      message: "Using fallback insights due to API connectivity issues"
    });
  }
};
