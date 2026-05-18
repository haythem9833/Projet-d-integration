import nextPlugin from "eslint-plugin-next";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next", "node_modules", "dist"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "@typescript-eslint": typescriptEslintPlugin,
      next: nextPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
