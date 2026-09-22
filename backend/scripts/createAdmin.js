import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully.");

    // Check whether admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@pulsehire.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin
    const admin = await User.create({
      fullname: "PulseHire Admin",
      email: "admin@pulsehire.com",
      phoneNumber: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully.");
    console.log("Admin ID:", admin._id);
    console.log("Email:", admin.email);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error);

    process.exit(1);
  }
};

createAdmin();
