import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores
    "coverage/**",
    "node_modules/**",
  ]),
  // Custom strict rules
  {
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "@typescript-eslint/consistent-type-imports": ["warn", {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }],

      // React rules
      "react/jsx-no-leaked-render": "warn",
      "react/jsx-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General code quality
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],

      // Import rules
      "import/no-duplicates": "warn",
      "import/order": ["warn", {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "type"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],

      // Accessibility rules (Chapter 15)
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/label-has-associated-control": ["error", {
        "assert": "either"
      }],
    },
  },
]);

export default eslintConfig;
