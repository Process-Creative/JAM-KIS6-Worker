module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ["eslint:recommended"],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["react"],
	rules: {
		"array-bracket-spacing": "error",
		"comma-dangle": [
			"error",
			{
				arrays: "never",
				objects: "never",
				imports: "never",
				exports: "never",
				functions: "never"
			}
		],
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		"no-console": [
			"error",
			{
				allow: ["warn", "error"]
			}
		],
		"no-else-return": "error",
		"no-unused-vars": "off",
		"no-undef": "off",
		"no-dupe-keys": "off",
		quotes: ["error", "double", { allowTemplateLiterals: true }],
		semi: ["error", "always"]
	},
	settings: {
		react: {
			version: "detect"
		}
	},
	overrides: [
		{
			files: ["component.js"],
			rules: {
				indent: ["error", 2]
			}
		}
	]
};