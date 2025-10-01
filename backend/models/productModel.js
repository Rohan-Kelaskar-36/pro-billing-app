import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "ProductName",
  required: true,
},

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // ✅ MUST match the model name
      required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
