module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
   'max-len': ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }]
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  env: {
    node: true
  },
};
