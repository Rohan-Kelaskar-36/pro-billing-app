import mongoose from "mongoose";

const productNameSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductName = mongoose.model("ProductName", productNameSchema);
export default ProductName;
