/**
 * Validates required environment variables at startup.
 * Logs warnings for missing optional vars; exits for critical ones in production.
 */
const REQUIRED = ["MONGO_URI", "JWT_SECRET"];
const OPTIONAL = [
  "GOOGLE_AI_API_KEY",
  "PINECONE_API_KEY",
  "NEO4J_URI",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
];

export function validateEnv(): void {
  const missing: string[] = [];
  const optionalMissing: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]?.trim()) {
      missing.push(key);
    }
  }

  for (const key of OPTIONAL) {
    if (!process.env[key]?.trim()) {
      optionalMissing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(
      `[env] Missing required environment variables: ${missing.join(", ")}`
    );
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  if (optionalMissing.length > 0 && process.env.NODE_ENV !== "test") {
    console.warn(
      `[env] Optional variables not set (some features may be limited): ${optionalMissing.join(", ")}`
    );
  }
}
