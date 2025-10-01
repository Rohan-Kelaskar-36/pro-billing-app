import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function TrendInsights() {
  const [question, setQuestion] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Global/store toggle removed; always use global insights per request
  const lastFetchRef = useRef(0);
  const hasFetchedOnceRef = useRef(false);

  const parseInsights = (text) => {
    if (!text) return [];
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const bullets = [];
    for (const line of lines) {
      if (/^[-*•]/.test(line)) {
        bullets.push(line.replace(/^[-*•]\s?/, ""));
      } else {
        bullets.push(line);
      }
    }
    return bullets;
  };

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const fetchInsights = async (opts = { auto: false }) => {
    // Cooldown for auto fetches to prevent repeated refresh: 60s
    if (opts.auto) {
      const now = Date.now();
      if (now - lastFetchRef.current < 60_000) {
        return; // within cooldown
      }
      lastFetchRef.current = now;
    } else {
      // manual fetch resets cooldown start
      lastFetchRef.current = Date.now();
    }
    setLoading(true);
    setError("");
    setInsights("");
    try {
      const res = await api.get(`/api/reports/insights/global`, { params: { question, t: Date.now() } });
      const data = res.data;
      setInsights(data?.insights || "No insights");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch insights");
    } finally {
      setLoading(false);
      hasFetchedOnceRef.current = true;
    }
  };

  useEffect(() => {
    // initial load returns general insights (no specific question)
    if (!hasFetchedOnceRef.current) {
      fetchInsights({ auto: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-teal-950">Insights</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Trending Questions"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div></div>
        </div>
        <div className="mt-3">
          <button
            onClick={fetchInsights}
            className="bg-teal-950 hover:bg-teal-900 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Insights"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Insights</h3>
        {!insights && !loading && (
          <div className="text-gray-500 text-sm">No data yet.</div>
        )}
        {loading && (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        )}
        {!loading && insights && (
          <ul className="list-disc pl-6 space-y-2">
            {parseInsights(insights).map((line, idx) => (
              <li key={idx} className="text-sm leading-6">{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


