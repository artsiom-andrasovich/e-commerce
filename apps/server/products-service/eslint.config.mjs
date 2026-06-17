import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'off',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prettier/prettier': [
        'error',
        {
          singleQuote: false,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 4,
          useTabs: true,
        },
      ],
    },
  },
  prettier,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
]
