import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import userRoutes       from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import exerciseRoutes   from "./routes/exerciseRoutes.js";
import goalRoutes       from "./routes/goalRoutes.js";
import paymentRoutes    from "./routes/paymentRoutes.js";

import './cron/attendanceCron.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded screenshots statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.get("/", (req, res) => res.send("SweatAndGain API Running ✅"));

app.use("/api/users",      userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exercises",  exerciseRoutes);
app.use("/api/goals",      goalRoutes);
app.use("/api/payment",    paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));