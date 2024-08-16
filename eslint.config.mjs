import globals from "globals";
import pluginJs from "@eslint/js";
import airbnbBase from "eslint-config-airbnb-base";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: { 
      globals: globals.browser 
    },

    rules: {
      ...airbnbBase.rules,
    },
  },
];