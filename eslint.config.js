import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: [
            '.next/**',
            'node_modules/**',
            'dist/**',
            'build/**',
            '*.config.js',
            '*.config.ts'
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: tsparser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-console': 'warn',
            'no-undef': 'off', // TypeScript handles this
        },
    },
];
