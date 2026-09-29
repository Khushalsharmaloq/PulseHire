import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";

const required = (name) => {
  const value = String(process.env[name] || "").trim();

  if (!value) {
    throw new Error(`${name} is required to create an admin.`);
  }

  return value;
};

const createAdmin = async () => {
  try {
    const mongoUri = required("MONGO_URI");
    const email = required("ADMIN_EMAIL").toLowerCase();
    const password = required("ADMIN_PASSWORD");
    const fullname = String(process.env.ADMIN_FULLNAME || "PulseHire Admin").trim();
    const phoneNumber = String(process.env.ADMIN_PHONE || "").trim();

    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new Error("ADMIN_PHONE must contain exactly 10 digits.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("An account already exists with ADMIN_EMAIL. No changes made.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
      recruiterVerification: {
        status: "not_required",
      },
    });

    console.log("Admin created successfully.");
    console.log("Admin ID:", admin._id);
    console.log("Email:", admin.email);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();
