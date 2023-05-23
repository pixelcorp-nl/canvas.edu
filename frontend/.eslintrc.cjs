module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['/build', '/.svelte-kit', '/package'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'array-callback-return': 'error',
		curly: ['error', 'all'],
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
		'no-constant-condition': ['error', { checkLoops: false }],
		eqeqeq: ['error', 'smart'],
		'@typescript-eslint/ban-ts-comment': 'off'
	}
}
