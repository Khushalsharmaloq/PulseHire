import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { validateEnvironment } from "./config/env.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`PulseHire server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start PulseHire:", error.message);
    process.exit(1);
  }
};

startServer();
