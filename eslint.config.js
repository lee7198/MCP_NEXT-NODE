import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'prettier': prettierPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react/require-default-props': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'react/jsx-props-no-spreading': 'off',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelAttributes: ['htmlFor'],
        },
      ],
      'import/prefer-default-export': 'off',
      'react/no-array-index-key': 'off',
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ignores: ['next.config.ts', 'postcss.config.mjs', '/out'],
  },
];
