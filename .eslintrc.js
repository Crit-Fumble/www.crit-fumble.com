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
      "./tsconfig.app.json",
      "./packages/*/tsconfig.json",
      "./agents/*/tsconfig.json"
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
    // Workspace-level import ordering
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
    
    // Workspace-level architectural boundaries
    "import/no-restricted-paths": ["error", {
      zones: [
        {
          target: "./packages/core/**/*",
          from: "./packages/!(worldanvil)/**/*",
          message: "Core package can only import from @crit-fumble/worldanvil"
        },
        {
          target: "./packages/react/**/*",
          from: "./packages/!(core)/**/*",
          message: "React package can only import from @crit-fumble/core"
        },
        {
          target: "./packages/next-web/**/*",
          from: "./packages/!(core|react)/**/*",
          message: "Next-web package can only import from @crit-fumble/core and @crit-fumble/react"
        },
        {
          target: "./agents/discord/**/*",
          from: "./packages/!(core)/**/*",
          message: "Discord agent can only import from @crit-fumble/core"
        }
      ]
    }],
    
    // TypeScript rules
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
    
    // React rules
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // General code quality
    "no-console": ["warn", {
      allow: ["warn", "error", "info", "debug"]
    }],
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  },
  
  // Ignore package-specific overrides since each package has its own config
  ignorePatterns: [
    "packages/*/dist/**",
    "packages/*/node_modules/**",
    "**/node_modules/**",
    "**/dist/**"
  ]
};