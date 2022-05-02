module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.cjs'],
    project: './tsconfig.json',
  },
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['webpack.*.cjs', 'tailwind.config.cjs'] },
    ],
  },
};
