module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "comma-dangle": ["warn", {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }]
    }
};