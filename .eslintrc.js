module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    autoComplete: 'readonly',
    tinymce: 'readonly',
    Chart: 'readonly',
    ChartDataLabels: 'readonly',
    List: 'readonly',
    pattern: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-async-promise-executor': 'off',
    'func-names': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': ['error', { allow: ['_data'] }],
    'no-new': 'off',
    'no-bitwise': 'off',
  },
};
