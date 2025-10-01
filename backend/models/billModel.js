// billModel.js

import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        ref:"ProductName",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      taxes: [
        {
          taxName: String,
          taxPercentage: Number,
          taxAmount: Number,
        },
      ],
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  // cashier: REMOVED
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  taxBreakdown: [
    {
      taxName: String,
      taxPercentage: Number,
      taxAmount: Number,
    },
  ],
  grandTotal: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
