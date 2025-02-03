// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default withNuxt(
  // Your custom configs here
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "vue/html-indent": [
        "error",
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: [],
        },
      ],
      "vue/multi-word-component-names": "off",
    },
  }
).prepend({
  ignores: ["public/*"],
})
