/**
 * Frontend configuration.
 * Set NEXT_PUBLIC_API_URL in .env.local for local development (e.g. http://localhost:3001).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homemind-backend.vercel.app";
