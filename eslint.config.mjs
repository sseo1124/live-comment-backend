import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";

const parserOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
  allowJs: true,
};

const projectGlobals = {
  browser: "readonly",
  chrome: "readonly",
  defineBackground: "readonly",
  defineContentScript: "readonly",
};

export default [
  {
    ignores: ["dist", ".output", ".wxt", "node_modules"],
  },
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...projectGlobals,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...projectGlobals,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_|^next$",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...projectGlobals,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    rules: {
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "log"],
        },
      ],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_|^next$",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  eslintConfigPrettier,
];
