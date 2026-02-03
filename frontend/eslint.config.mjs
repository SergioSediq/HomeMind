import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "out/**", "dist/**", "build/**", "coverage/**", "*.config.js", "*.config.mjs", "*.config.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["pages/chat.tsx"],
    rules: {
      "react/no-unstable-nested-components": "off",
    },
  },
];

export default eslintConfig;
