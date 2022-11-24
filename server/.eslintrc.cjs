/*
module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  }
}
*/
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "linebreak-style": ["error", "windows"],
    "indent": "off",
    "object-curly-spacing": "off",
    "no-tabs": 0,
    "max-len": "off",
    "require-jsdoc": 0,
    "no-empty": [0, "allow-empty-functions", "allow-empty-catch"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/naming-convention": ["off"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-mixed-spaces-and-tabs": 0,
    "camelcase": 0,
  },
};