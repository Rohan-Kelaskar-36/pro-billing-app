import Cashier from "../models/cashierModel.js";
import Manager from "../models/managerModel.js";
import bcrypt from "bcryptjs";

// Utility to create user
const createUserByRole = async ({ name, email, role }) => {
  const isCashier = role === "Cashier";
  const isManager = role === "Manager";

  const Model = isCashier ? Cashier : Manager;
  const defaultPassword = isCashier
    ? process.env.DEFAULT_CASHIER_PASSWORD
    : process.env.DEFAULT_MANAGER_PASSWORD;

  const existing = await Model.findOne({ email });
  if (existing) {
    throw new Error(`${role} already exists`);
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const newUser = new Model({
  name,
  email,
  password: defaultPassword, // ✅ plain text here
  storeId: null,
  storeName: "",
});


  await newUser.save();
  return `${role} created successfully`;
};

// Controller: Create Cashier or Manager
export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Cashier", "Manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const message = await createUserByRole({ name, email, role });
    return res.status(201).json({ message });
  } catch (error) {
    console.error("Create user error:", error.message);
    const status = error.message.includes("already exists") ? 400 : 500;
    res.status(status).json({ message: error.message || "Internal server error" });
  }
};

// Controller: Get all users (cashiers + managers) for Assign page
export const getAllUsers = async (req, res) => {
  try {
    const [cashiers, managers] = await Promise.all([
      Cashier.find({}, "name email storeName"),
      Manager.find({}, "name email storeName"),
    ]);

    const allUsers = [
      ...managers.map(user => ({ ...user.toObject(), role: "Manager" })),
      ...cashiers.map(user => ({ ...user.toObject(), role: "Cashier" })),
    ];

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
