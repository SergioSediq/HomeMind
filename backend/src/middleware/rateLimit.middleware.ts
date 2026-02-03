import rateLimit from "express-rate-limit";

/** General API rate limit: 100 requests per 15 minutes per IP */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Stricter limit for chat endpoints (costly LLM calls) */
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Rate limit exceeded. Please wait before sending more messages." },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Auth endpoints: prevent brute-force */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
