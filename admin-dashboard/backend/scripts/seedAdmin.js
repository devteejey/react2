import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Admin" } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in backend/.env before seeding.");
}
if (ADMIN_PASSWORD.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
}

try {
  await mongoose.connect(MONGODB_URI);
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.updateOne(
    { email: ADMIN_EMAIL.trim().toLowerCase() },
    {
      $set: {
        name: ADMIN_NAME.trim(),
        email: ADMIN_EMAIL.trim().toLowerCase(),
        password,
        role: "Administrator",
        status: "Active",
      },
    },
    { upsert: true, runValidators: true }
  );
  console.log(`Administrator account ready for ${ADMIN_EMAIL.trim().toLowerCase()}.`);
} catch (error) {
  console.error("Unable to seed the administrator:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
