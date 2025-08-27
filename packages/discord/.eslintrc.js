module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_' 
    }],
    'no-console': 'off',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
