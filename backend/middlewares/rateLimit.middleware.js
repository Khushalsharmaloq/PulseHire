const buckets = new Map();

const cleanupTimer = setInterval(() => {
  const now = Date.now();

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000);

cleanupTimer.unref?.();

const getClientKey = (req, prefix) =>
  `${prefix}:${req.ip || req.socket?.remoteAddress || "unknown"}`;

export const createRateLimiter = ({
  windowMs,
  max,
  prefix = "default",
  message = "Too many requests. Please try again later.",
}) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req, prefix);
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    existing.count += 1;

    if (existing.count > max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      );

      res.setHeader("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds,
      });
    }

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  prefix: "auth",
  message: "Too many authentication attempts. Please try again later.",
});

export const registrationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 8,
  prefix: "register",
  message: "Too many account creation attempts. Please try again later.",
});

export const publicJobRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  prefix: "jobs",
});
