import mongoose from "mongoose";




const taxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, // ✅ ADD THIS LINE
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Tax = mongoose.model("Tax", taxSchema);
export default Tax;
