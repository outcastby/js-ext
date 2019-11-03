module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/interface-name-prefix': [1, { "prefixWithI": "never" }],
    // Special ESLint rules or overrides go here.
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "react/prop-types": "off"
      }
    }
  ]
}
