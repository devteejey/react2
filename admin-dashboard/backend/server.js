import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/users.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in backend/.env.");
}
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.length < 32 ||
  process.env.JWT_SECRET.includes("replace-with")
) {
  throw new Error("Set JWT_SECRET to a unique random value of at least 32 characters in backend/.env.");
}

app.use(helmet());
app.use(cors({
  origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()),
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error.code === 11000) {
    return response.status(409).json({ message: "A user with this email address already exists." });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ message: error.message });
  }

  console.error("API request failed:", error);
  return response.status(500).json({
    message: process.env.NODE_ENV === "production"
      ? "An unexpected server error occurred."
      : error.message,
  });
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Admin dashboard API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Unable to connect to MongoDB:", error);
  process.exitCode = 1;
}
