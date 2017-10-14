module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "arrow-body-style": ["off", "as-needed"],
      "comma-dangle": ["warn", {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }],
      "max-len": ["warn", {
        "code": 100,
        "ignoreComments": true
      }],
      "no-param-reassign": ["off"],
      "no-unused-expressions": ["error", {
        "allowTernary": true
      }],
      "spaced-comment": ["off"]
    }
};
