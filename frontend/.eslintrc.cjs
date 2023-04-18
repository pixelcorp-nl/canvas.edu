module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'array-callback-return': 'error',
		'curly': ['error', 'all'],
		'no-array-constructor': 'error',
		'no-duplicate-imports': ['error', { includeExports: true }],
		'no-extend-native': 'error',
		'no-nested-ternary': 'error',
		'no-return-assign': 'error',
		'no-return-await': 'error',
		'no-throw-literal': 'error',
		'no-unreachable-loop': 'error',
		'no-unused-private-class-members': 'error',
		'no-useless-catch': 'error',
		'no-useless-escape': 'error',
		'no-useless-return': 'error',
		'no-var': 'error',
		// 'prefer-arrow-callback': 'error', // TODO: enable
		'prefer-const': 'error',
		'prefer-template': 'error',
		'require-await': 'error',
		'no-constant-condition': ['error', { 'checkLoops': false }],
		eqeqeq: ['error', 'smart'],
		'@typescript-eslint/ban-ts-comment': 'off',
	}
};
