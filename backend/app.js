import marketingRoutes from "./routes/marketingRoutes.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import billRoutes from "./routes/billRoutes.js";
import connectDB from './config/db.js';
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import assignRoutes from "./routes/assignRoutes.js"
import storeRoutes from "./routes/storeRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js'
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import taxRoutes from './routes/taxRoutes.js'

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/bills", billRoutes);
app.use("/api/products", productRoutes);
app.use("/api/assign", assignRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/attributes", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/tax",taxRoutes);
app.use("/api/marketing", marketingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


export default app;
