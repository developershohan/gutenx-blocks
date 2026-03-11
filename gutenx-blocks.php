<?php
/**
 * Plugin Name:       GutenX Blocks
 * Plugin URI:        https://gutenxblocks.com
 * Description:       A powerful collection of custom Gutenberg blocks with advanced controls, reusable inspector panels, and a template library. Build stunning pages faster.
 * Version:           1.0.0
 * Requires at least: 6.3
 * Requires PHP:      8.0
 * Author:            GutenX
 * Author URI:        https://gutenxblocks.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gutenx-blocks
 * Domain Path:       /languages
 *
 * @package GutenX_Blocks
 */

// Security check — prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin version.
 *
 * @var string
 */
define( 'GUTENX_VERSION', '1.0.0' );

/**
 * Plugin directory path (with trailing slash).
 *
 * @var string
 */
define( 'GUTENX_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL (with trailing slash).
 *
 * @var string
 */
define( 'GUTENX_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 *
 * @var string
 */
define( 'GUTENX_BASENAME', plugin_basename( __FILE__ ) );

// Require Composer autoloader.
if ( file_exists( GUTENX_DIR . 'vendor/autoload.php' ) ) {
	require_once GUTENX_DIR . 'vendor/autoload.php';
}

/**
 * Initialize the plugin on plugins_loaded.
 *
 * @return void
 */
function gutenx_blocks_init() {
	\GutenX_Blocks\Core\GutenX_Core::get_instance();
}
add_action( 'plugins_loaded', 'gutenx_blocks_init' );

/**
 * Plugin activation callback.
 *
 * Sets default options and flushes rewrite rules.
 *
 * @return void
 */
function gutenx_blocks_activate() {
	// Set default block states — all blocks enabled.
	if ( false === get_option( 'gutenx_block_states' ) ) {
		$default_blocks = array(
			'gutenx-blocks/advanced-heading' => true,
			'gutenx-blocks/advanced-button'  => true,
			'gutenx-blocks/container'        => true,
			'gutenx-blocks/row'              => true,
			'gutenx-blocks/icon-box'         => true,
			'gutenx-blocks/testimonial'      => true,
			'gutenx-blocks/image-gallery'    => true,
		);
		update_option( 'gutenx_block_states', $default_blocks );
	}

	// Set default settings.
	if ( false === get_option( 'gutenx_settings' ) ) {
		update_option( 'gutenx_settings', array( 'version' => GUTENX_VERSION ) );
	}

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'gutenx_blocks_activate' );

/**
 * Plugin deactivation callback.
 *
 * @return void
 */
function gutenx_blocks_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'gutenx_blocks_deactivate' );

/**
 * Register uninstall hook.
 */
register_uninstall_hook( __FILE__, 'gutenx_blocks_uninstall' );

/**
 * Plugin uninstall callback.
 *
 * @return void
 */
function gutenx_blocks_uninstall() {
	delete_option( 'gutenx_settings' );
	delete_option( 'gutenx_block_states' );
}
