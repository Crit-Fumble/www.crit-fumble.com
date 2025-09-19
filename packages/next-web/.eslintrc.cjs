module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    project: "./tsconfig.json",
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
    "react-hooks"
  ],
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      }
    },
    "import/internal-regex": "^@crit-fumble/"
  },
  rules: {
    // Import ordering and restrictions
    "import/order": ["error", {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      pathGroups: [{
        pattern: "@crit-fumble/**",
        group: "internal",
        position: "before"
      }],
      "newlines-between": "always",
      alphabetize: { order: "asc" }
    }],
    
    // Enforce architectural boundaries - next-web can import from core and react
    "import/no-restricted-paths": ["error", {
      zones: [{
        target: "./",
        from: "../!(core|react)/**",
        message: "Next-web package can only import from @crit-fumble/core and @crit-fumble/react"
      }]
    }],
    
    // TypeScript specific rules
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
    
    // React specific rules
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // Next.js specific rules
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "warn",
    
    // General code quality
    "no-console": ["warn", {
      allow: ["warn", "error", "info", "debug"]
    }],
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  }
};