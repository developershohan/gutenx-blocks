/**
 * GutenX Blocks — Webpack Configuration
 *
 * Extends the default @wordpress/scripts webpack config.
 * Production builds: Terser JS minification + CSS minification + no source maps.
 * Development builds: source maps enabled for debugging.
 *
 * @package GutenX_Blocks
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Block slugs — each gets its own entry point.
 */
const blockSlugs = [
	'advanced-heading',
	'advanced-button',
	'container',
	'row',
	'icon-box',
	'testimonial',
	'image-gallery',
];

/**
 * Build entry points for all blocks.
 */
const blockEntries = {};
blockSlugs.forEach( ( slug ) => {
	blockEntries[ `blocks/${ slug }/index` ] = path.resolve(
		process.cwd(),
		`src/blocks/${ slug }/index.js`
	);
} );

module.exports = {
	...defaultConfig,

	entry: {
		// Admin SPA dashboard entry.
		admin: path.resolve( process.cwd(), 'src/admin/index.js' ),

		// Shared editor utilities entry.
		editor: path.resolve( process.cwd(), 'src/editor/index.js' ),

		// Individual block entries.
		...blockEntries,
	},

	output: {
		path: path.resolve( process.cwd(), 'build' ),
		filename: '[name].js',
		clean: true,
	},

	// Production optimizations.
	optimization: {
		...( defaultConfig.optimization || {} ),
		minimize: isProduction,
		minimizer: [
			// Terser — minify JS, strip comments, mangle variable names.
			new TerserPlugin( {
				terserOptions: {
					compress: {
						drop_console: isProduction,
						drop_debugger: isProduction,
						passes: 2,
					},
					mangle: {
						safari10: true,
					},
					format: {
						comments: false,
					},
				},
				extractComments: false,
				parallel: true,
			} ),
			// CssMinimizerPlugin — minify all CSS output.
			new CssMinimizerPlugin( {
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
						},
					],
				},
			} ),
		],
	},

	// Source maps: disabled in production, enabled in development.
	devtool: isProduction ? false : 'source-map',

	// Performance hints for production bundles.
	performance: {
		hints: isProduction ? 'warning' : false,
		maxAssetSize: 250000,
		maxEntrypointSize: 250000,
	},
};
