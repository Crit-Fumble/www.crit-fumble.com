module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "react",
    "react-hooks",
    "crit-fumble-architecture",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:crit-fumble-architecture/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // Base ESLint rules
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "no-unused-vars": "off", // Handled by TypeScript
    
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Import rules - basic order
    "import/order": [
      "error",
      {
        groups: [
          "builtin", 
          "external", 
          "internal", 
          ["parent", "sibling"], 
          "index"
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before"
          },
          {
            pattern: "@cfg/**",
            group: "internal",
            position: "after"
          }
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true }
      }
    ],
    "import/no-duplicates": "error",
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      env: {
        jest: true,
      },
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
};
