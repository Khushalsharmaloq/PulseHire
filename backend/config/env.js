import "dotenv/config";

const required = (name) => {
  const value = String(process.env[name] || "").trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
};

export const getAllowedOrigins = () => {
  const configured = String(process.env.CLIENT_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  if (process.env.NODE_ENV !== "production") {
    return ["http://localhost:5173"];
  }

  return [];
};

export const validateEnvironment = () => {
  required("MONGO_URI");
  const jwtSecret = required("JWT_SECRET");
  required("CLOUDINARY_CLOUD_NAME");
  required("CLOUDINARY_API_KEY");
  required("CLOUDINARY_API_SECRET");

  if (process.env.NODE_ENV === "production" && jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production.");
  }

  if (process.env.NODE_ENV === "production" && getAllowedOrigins().length === 0) {
    throw new Error("CLIENT_ORIGINS must be configured in production.");
  }
};
