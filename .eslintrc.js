module.exports = {
	"env": {
		"browser": true,
		"es2020": true,
		"node": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:lodash/canonical"
	],
	"parserOptions": {
		"ecmaVersion": 11,
		"sourceType": "module"
	},
	"plugins": [
		"lodash"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
