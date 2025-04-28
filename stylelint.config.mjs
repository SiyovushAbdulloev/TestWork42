export default {
  extends: [
    "stylelint-config-standard-scss"
  ],
  plugins: [
    "stylelint-scss"
  ],
  rules: {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-block-no-duplicate-properties": true,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "local"]
      }
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes"]
      }
    ]
  }
};
