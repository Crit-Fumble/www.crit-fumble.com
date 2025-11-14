module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals"
  ],
  rules: {
    // Allow console statements but warn
    "no-console": "warn",
    // Disable some rules that can be overly strict
    "react/no-unescaped-entities": "off"
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "dist/**"
  ]
};