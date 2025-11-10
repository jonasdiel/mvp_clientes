const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nxEslintPlugin = require('@nx/eslint-plugin');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.nx/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
      '**/*.log',
      '**/.env*',
      '**/.vscode/**',
      '**/.idea/**',
      '**/.DS_Store',
      '**/migrations/*.ts',
      '**/*.d.ts',
    ],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'off', // Allow path aliases like @/ in imports
      '@typescript-eslint/no-require-imports': 'off', // Allow require in config files
    },
  },
];
