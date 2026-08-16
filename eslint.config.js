const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    ignores: ["dist/**", "js/game.js", "node_modules/**"],
  },
  {
    files: ["js/**/*.js", "scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },
    rules: {
      "no-array-constructor": "error",
      "no-object-constructor": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": "error",
    },
  },
]);
