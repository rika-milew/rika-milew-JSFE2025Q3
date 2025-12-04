import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020
      }
    },
    plugins: {
      "@typescript-eslint": ts,
      "prettier": prettier,
      "import": importPlugin
    },
    rules: {
      ...ts.configs.recommended.rules,
      "no-debugger": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "prettier/prettier": "error"
    }
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        browser: true,
        es2020: true,
        node: true
      }
    },
    rules: {
      "no-debugger": "off",
      "no-console": "off"
    }
  },
  
  {
    ignores: [
      "**/*.css",
      "dist/**",
      "webpack.*.js",
      "node_modules/**",
      "*.config.js"
    ]
  }
];