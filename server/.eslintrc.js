module.exports = {
    env: {
        browser: true, // Browser global variables like `window` etc.
        commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
        es6: true, // Enable all ECMAScript 6 features except for modules.
        jest: true, // Jest global variables like `it` etc.
        node: true // Defines things like process.env when generating through node
    },
    extends: [
        "eslint:recommended",
        "prettier"
    ],
    parser: "@babel/eslint-parser", // Uses babel-eslint transforms.
    parserOptions: {
        ecmaFeatures: {
        },
        ecmaVersion: 2018,
        sourceType: "module",
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    },
    plugins: [],
    root: true, // For configuration cascading. 
    rules: {
        indent: [
            "error",
            4
        ],
        quotes: [
            "warn",
            "single"
        ]
    },
    settings: {
    }
};