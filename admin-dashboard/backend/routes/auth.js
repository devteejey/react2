import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many sign-in attempts. Try again in 15 minutes." },
});

router.post("/login", loginLimiter, async (request, response, next) => {
  try {
    const email = typeof request.body.email === "string"
      ? request.body.email.trim().toLowerCase()
      : "";
    const password = typeof request.body.password === "string"
      ? request.body.password
      : "";

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || user.status !== "Active" || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({ message: "Email or password is incorrect." });
    }

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "12h",
    });

    return response.json({ token, user: user.toJSON() });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (request, response) => {
  response.json({ user: request.user });
});

export default router;
