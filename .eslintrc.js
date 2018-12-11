module.exports = {
    'env': {
        'browser': true,
    },
    'parser': 'babel-eslint',
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaFeatures': {
            'classes': true,
            'jsx': true
        },
        'ecmaVersion': 2016,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        "react/jsx-uses-vars": "error",
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
