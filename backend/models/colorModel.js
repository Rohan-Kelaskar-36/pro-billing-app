// models/colorModel.js
import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  colorName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Color = mongoose.model("Color", colorSchema);
export default Color;
