import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist'], // Ignore built files
  },
  {
    files: ['**/*.{ts,tsx}'], // Target TypeScript and TSX files
    languageOptions: {
      parser: '@typescript-eslint/parser', // Use the TypeScript parser
      parserOptions: {
        ecmaVersion: 2020, // Use modern ECMAScript features
        sourceType: 'module', // Enable ES modules
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    extends: [
      'eslint:recommended', // Basic linting rules
      'plugin:@typescript-eslint/recommended', // TypeScript rules
      'plugin:react/recommended', // React rules
    ],
    rules: {
      ...reactHooks.configs.recommended.rules, // React hooks rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Example TypeScript-specific rule
    },
  },
];
