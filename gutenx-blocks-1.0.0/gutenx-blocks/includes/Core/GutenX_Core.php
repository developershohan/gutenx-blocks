<?php
/**
 * GutenX Core — Singleton Bootstrapper
 *
 * Initializes all plugin components on plugins_loaded.
 *
 * @package GutenX_Blocks\Core
 * @since   1.0.0
 */

namespace GutenX_Blocks\Core;

use GutenX_Blocks\API\REST_Controller;
use GutenX_Blocks\Admin\Admin_Page;
use GutenX_Blocks\Blocks\Block_Loader;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GutenX_Core
 *
 * Main plugin class using the Singleton pattern.
 * Bootstraps all plugin modules on plugins_loaded.
 *
 * @since 1.0.0
 */
class GutenX_Core {

	/**
	 * Singleton instance.
	 *
	 * @var GutenX_Core|null
	 */
	private static ?GutenX_Core $instance = null;

	/**
	 * Hook loader instance.
	 *
	 * @var Loader
	 */
	private Loader $loader;

	/**
	 * Private constructor — prevents direct instantiation.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->loader = new Loader();
		$this->init();
	}

	/**
	 * Prevent cloning.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function __clone() {}

	/**
	 * Prevent unserialization.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 * @throws \Exception Always.
	 */
	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize singleton.' );
	}

	/**
	 * Get the singleton instance.
	 *
	 * @since 1.0.0
	 *
	 * @return GutenX_Core
	 */
	public static function get_instance(): GutenX_Core {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initialize all plugin components.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function init(): void {
		$this->load_textdomain();

		// Initialize components.
		$admin_page      = new Admin_Page();
		$rest_controller = new REST_Controller();
		$block_loader    = new Block_Loader();

		// Register admin hooks.
		$this->loader->add_action( 'admin_menu', $admin_page, 'register_menu' );
		$this->loader->add_action( 'admin_enqueue_scripts', $admin_page, 'enqueue_admin_assets' );

		// Register REST API hooks.
		$this->loader->add_action( 'rest_api_init', $rest_controller, 'register_routes' );

		// Register block hooks.
		$this->loader->add_action( 'init', $block_loader, 'register_blocks' );
		$this->loader->add_filter( 'block_categories_all', $block_loader, 'get_block_categories', 10, 2 );
		$this->loader->add_action( 'enqueue_block_editor_assets', $block_loader, 'enqueue_block_assets' );

		// Run all registered hooks.
		$this->loader->run();
	}

	/**
	 * Load the plugin text domain for i18n.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function load_textdomain(): void {
		load_plugin_textdomain(
			'gutenx-blocks',
			false,
			dirname( GUTENX_BASENAME ) . '/languages'
		);
	}

	/**
	 * Get the plugin version.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public static function version(): string {
		return GUTENX_VERSION;
	}

	/**
	 * Get the plugin URL.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public static function plugin_url(): string {
		return GUTENX_URL;
	}

	/**
	 * Get the plugin directory path.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public static function plugin_dir(): string {
		return GUTENX_DIR;
	}
}
