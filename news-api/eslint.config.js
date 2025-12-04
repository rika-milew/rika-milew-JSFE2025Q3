import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const tsRecommended = tsPlugin.configs.recommended;
const tsTypeChecked = tsPlugin.configs["recommended-type-checked"];
const prettierRecommended = prettierPlugin.configs.recommended;

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
     "@typescript-eslint": tsPlugin,
     "prettier": prettierPlugin,
      "import": importPlugin
    },
    rules: {
      ...tsRecommended.rules,
      ...tsTypeChecked.rules,
      ...prettierRecommended.rules,
      "no-debugger": "off",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/explicit-function-return-type": "error", 
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "prettier/prettier": "error",
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