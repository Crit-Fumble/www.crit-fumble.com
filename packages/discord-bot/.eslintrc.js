module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    // Discord bot specific rules
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error", "info", "debug"] }],
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: ["*.js"],
      parser: "espree",
      env: {
        node: true,
        es6: true,
      },
    }
  ],
  ignorePatterns: ["*.js", "dist/", "node_modules/"]
};