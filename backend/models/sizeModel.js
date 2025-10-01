// models/sizeModel.js
import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  sizeName: {
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

const Size = mongoose.model("Size", sizeSchema);
export default Size;
