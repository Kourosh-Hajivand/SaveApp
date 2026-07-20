const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

const isProduction = process.env.NODE_ENV === "production";

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    rules: {
      "no-console": isProduction
        ? ["error", { allow: ["warn", "error"] }]
        : ["warn", { allow: ["warn", "error", "info"] }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
