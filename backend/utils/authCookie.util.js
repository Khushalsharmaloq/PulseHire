const allowedSameSiteValues = new Set(["lax", "strict", "none"]);

export const getAuthCookieOptions = () => {
  const configuredSameSite = String(process.env.COOKIE_SAME_SITE || "lax")
    .trim()
    .toLowerCase();

  const sameSite = allowedSameSiteValues.has(configuredSameSite)
    ? configuredSameSite
    : "lax";

  const secure =
    process.env.COOKIE_SECURE === "true" ||
    process.env.NODE_ENV === "production" ||
    sameSite === "none";

  return {
    httpOnly: true,
    sameSite,
    secure,
    maxAge: 24 * 60 * 60 * 1000,
  };
};
