import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateStore = () => {
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://groovy-backend-km9g.onrender.com/api/stores/create", {
        storeId,
        storeName,
        location,
      });

      if (res.status === 201) {
        toast.success("✅ Store created successfully!");
        setStoreId("");
        setStoreName("");
        setLocation("");
      } else {
        toast.error("❌ Something went wrong!");
      }
    } catch (err) {
      toast.error("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-black-700">Create New Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Store ID</label>
          <input
            type="text"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-teal-950 px-4 py-2 rounded hover:bg-teal-900 text-white"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>
    </div>
  );
};

export default CreateStore;
