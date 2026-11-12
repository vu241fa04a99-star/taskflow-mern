import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("TaskFlow API is running"));
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
