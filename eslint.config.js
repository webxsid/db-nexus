import tsEslint from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import eslint from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    ignores: [
      "**/node_modules/",
      "**/dist/**",
      "**/.history/**",
      "**/.git/",
      "**/.vscode/",
      "**/.next/",
      "**/.vercel/",
      "**/.netlify/",
      "**/.now/",
      "**/.firebase/",
      "**/.yarn/",
      "**/.pnp/",
      "**/.yarnrc/",
      "**/.yarn-integrity/",
      "tsconfig.json",
      "tsconfig.*.json",
      "*.config.js",
      "*.config.ts",
    ],
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      eslint,
      react,
      "react-hooks": reactHooks,
      reactRefresh,
      "@typescript-eslint": tsEslint,
      "eslint-config-prettier": eslintConfigPrettier,
      prettier: eslintPluginPrettierRecommended,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
      "@typescript-eslint/no-unused-expressions": "error",
      "no-undef": "error",
      "prefer-arrow-callback": "off",
      "arrow-body-style": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
        {
          selector: "method",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          prefix: ["T"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
          prefix: ["E"],
        },
        {
          selector: "class",
          format: ["PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "classMethod",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
    },
  },
];
