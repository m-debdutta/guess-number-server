module.exports = {
  env: {
    "es2021": true
  },
  parserOptions: {
    "ecmaVersion": "latest"
  },
  rules: {
    "semi": ["error", "always"],
    "no-extra-parens": ["warn"],
    "eqeqeq": ["error"],
    "no-unused-vars": ["warn"],
    "no-unreachable": ["error"],
    "no-unsafe-negation": ["error"],
    "no-unused-private-class-members": ["error"],
    "camelcase": ["error"],
    "max-params": ["error", 3],
    "no-trailing-spaces": ["error"],
    "array-callback-return": ["error", { "checkForEach": true }],
    "prefer-const": ["error"],
    "semi": "warn",
    "array-callback-return": ["error", { checkForEach: true }],
    "no-cond-assign": "error",
    "no-dupe-keys": "error",
    "no-fallthrough": "warn",
    "no-sparse-arrays": "warn",
    "no-this-before-super": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    "camelcase": "warn",
    "complexity": ["warn", 10],
    "default-param-last": "error",
    "dot-notation": "warn",
    "max-depth": ["warn", 3],
    "max-statements": "warn",
    "new-cap": "error",
    "no-eval": "warn",
    "no-extra-semi": "warn",
    "no-nested-ternary": "warn",
    "no-plusplus": "warn",
    "no-undef-init": "warn",
    "no-unneeded-ternary": "error",
    "no-useless-escape": "warn",
    "prefer-const": "warn",
    "comma-spacing": ["warn", { before: false, after: true }],
    "key-spacing": ["error", { "beforeColon": false }],
    "no-multiple-empty-lines": "error"
  },
};