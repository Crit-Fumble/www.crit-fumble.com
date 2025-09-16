module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    project: [
      "./tsconfig.json",
      "./packages/*/tsconfig.json"
    ],
    tsconfigRootDir: __dirname
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "react",
    "react-hooks"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json", "packages/*/tsconfig.json"]
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    "import/internal-regex": "^@crit-fumble/"
  },
  rules: {
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
    "import/no-internal-modules": ["error", {
      allow: ["@crit-fumble/*/**", "@crit-fumble/*/models"]
    }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", {
      allow: ["warn", "error", "info", "debug"]
    }],
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  },
  overrides: [{
    files: ["packages/core/**/*.ts"],
    rules: {
      "import/no-restricted-paths": ["error", {
        zones: [{
          target: "./packages/core",
          from: "./packages/!(core)/**",
          message: "Core package cannot import from other packages"
        }]
      }]
    }
  }, {
    files: ["packages/next-web/**/*.ts", "packages/next-web/**/*.tsx"],
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }]
};