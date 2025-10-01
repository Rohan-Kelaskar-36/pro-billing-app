import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const managerSchema = new mongoose.Schema({
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
    default: "", // Will be set using process.env.DEFAULT_MANAGER_PASSWORD
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
