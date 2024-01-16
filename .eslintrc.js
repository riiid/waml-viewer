/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  plugins: [
    "@jjoriping/eslint-plugin"
  ],
  extends: [
    "plugin:@jjoriping/eslint-plugin/all"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@jjoriping/variable-name": [
      "error",
      { exceptions: [ "R", "$R", "children" ] }
    ]
  },
  ignorePatterns: [ "dist", "test", ".eslintrc.js" ]
};