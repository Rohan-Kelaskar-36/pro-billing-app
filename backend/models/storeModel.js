import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cashier: {
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String, // ✅ changed from ObjectId to String
    default: "",
  },
},
manager: {
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String, // ✅ changed from ObjectId to String
    default: "",
  },
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Store = mongoose.model("Store", storeSchema);
export default Store;
