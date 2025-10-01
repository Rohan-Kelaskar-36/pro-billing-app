import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CashierPromotions = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [discount, setDiscount] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log("[promotions][FE] fetching events", {
          apiBase: API_BASE,
          cookies: document.cookie,
        });
        const res = await axios.get(`${API_BASE}/api/marketing/events`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setEvents(res.data?.events || []);
      } catch (e) {
        console.error("[promotions][FE] events error", {
          message: e?.message,
          status: e?.response?.status,
          data: e?.response?.data,
          headers: e?.response?.headers,
        });
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const selectedEvent = selectedIndex != null ? events[selectedIndex] : null;

  const sendAll = async () => {
    try {
      const storeId = Cookies.get("cashier_storeId");
      if (!storeId) {
        toast.error("Store ID missing");
        return;
      }
      if (!selectedEvent) {
        toast.error("Select an event");
        return;
      }
      const pct = Number(discount);
      if (!Number.isFinite(pct) || pct <= 0 || pct > 90) {
        toast.error("Enter a valid discount (1-90)");
        return;
      }
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/marketing/campaign`,
        {
          storeId,
          eventName: selectedEvent.name,
          discountPercent: pct,
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(`Sent ${res.data?.sent || 0} emails`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Promotions & Events</h2>
      <p className="text-sm text-gray-600">Get upcoming holidays/festivals via AI, choose one, set discount, and email all previous buyers.</p>

      <div className="bg-white shadow rounded p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                console.log("[promotions][FE] refresh events", {
                  apiBase: API_BASE,
                  cookies: document.cookie,
                });
                const res = await axios.get(`${API_BASE}/api/marketing/events`, {
                  withCredentials: true,
                  headers: { "Content-Type": "application/json" },
                });
                setEvents(res.data?.events || []);
              } catch (e) {
                console.error("[promotions][FE] refresh error", {
                  message: e?.message,
                  status: e?.response?.status,
                  data: e?.response?.data,
                  headers: e?.response?.headers,
                });
                toast.error("Refresh failed");
              } finally {
                setLoading(false);
              }
            }}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-3 text-gray-600">Loading...</p>
        ) : events.length === 0 ? (
          <p className="mt-3 text-gray-600">No events found.</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {events.map((e, idx) => (
              <button
                key={`${e.name}-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className={`text-left border rounded p-3 hover:bg-gray-50 ${selectedIndex === idx ? "ring-2 ring-indigo-500" : ""}`}
              >
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-gray-600">{e.date} • {e.type}</div>
                {e.note ? <div className="text-xs text-gray-500 mt-1">{e.note}</div> : null}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold">Discount & Send</h3>
        <div className="mt-3 flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Selected Event</label>
            <input
              type="text"
              readOnly
              value={selectedEvent ? `${selectedEvent.name} (${selectedEvent.date})` : ""}
              placeholder="Select an event above"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
            <input
              type="number"
              min="1"
              max="90"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-40 border rounded p-2"
              placeholder="e.g. 15"
            />
          </div>
          <button
            onClick={sendAll}
            disabled={loading || !selectedEvent}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          >
            Send All
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Sends a decorated email to all prior customers with emails for your store.</p>
      </div>
    </div>
  );
};

export default CashierPromotions;


