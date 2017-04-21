module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "arrow-body-style": ["off", "as-needed"],
      "no-param-reassign": ["off"],
      "no-unused-expressions": ["error", {
        "allowTernary": true
      }],
      "max-len": ["warn", {
        "code": 100,
        "ignoreComments": true
      }],
      "comma-dangle": ["warn", {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }]
    }

};