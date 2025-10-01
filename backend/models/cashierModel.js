import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const cashierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: false,
  },
  storeName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔐 Hash password before saving
cashierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // ❌ gets hashed again
  next();
});


const Cashier = mongoose.model("Cashier", cashierSchema);
export default Cashier;
