const defaultConfig = require( '@wordpress/scripts/config/.eslintrc.js' );

module.exports = {
	...defaultConfig,
	rules: {
		...defaultConfig.rules,
		// Allow console.error for error logging.
		'no-console': [ 'warn', { allow: [ 'error', 'warn' ] } ],
		// Allow unused vars prefixed with underscore.
		'no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ],
		// Relax JSX requirement for fragments.
		'react/jsx-no-useless-fragment': 'off',
	},
	settings: {
		...( defaultConfig.settings || {} ),
		react: {
			version: 'detect',
		},
	},
};
