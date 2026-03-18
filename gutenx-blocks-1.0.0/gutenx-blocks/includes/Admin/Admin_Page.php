<?php
/**
 * Admin Page
 *
 * Registers the GutenX Blocks admin menu page and enqueues
 * the React SPA dashboard scripts and styles.
 *
 * @package GutenX_Blocks\Admin
 * @since   1.0.0
 */

namespace GutenX_Blocks\Admin;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Page
 *
 * @since 1.0.0
 */
class Admin_Page {

	/**
	 * The menu page hook suffix.
	 *
	 * @var string
	 */
	private string $page_hook = '';

	/**
	 * Register the admin menu page.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_menu(): void {
		$this->page_hook = add_menu_page(
			__( 'GutenX Blocks', 'gutenx-blocks' ),
			__( 'GutenX Blocks', 'gutenx-blocks' ),
			'manage_options',
			'gutenx-blocks',
			array( $this, 'render_page' ),
			'dashicons-layout',
			58
		);
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * Only loads on the GutenX Blocks admin page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook The current admin page hook suffix.
	 *
	 * @return void
	 */
	public function enqueue_admin_assets( string $hook ): void {
		// Only enqueue on our admin page.
		if ( 'toplevel_page_gutenx-blocks' !== $hook ) {
			return;
		}

		$admin_asset_path = trailingslashit( GUTENX_DIR ) . 'build/admin.asset.php';
		$admin_asset      = file_exists( $admin_asset_path )
			? require $admin_asset_path
			: array(
				'dependencies' => array(),
				'version'      => GUTENX_VERSION,
			);

		// Enqueue admin script.
		wp_enqueue_script(
			'gutenx-admin',
			trailingslashit( GUTENX_URL ) . 'build/admin.js',
			array_merge(
				$admin_asset['dependencies'] ?? array(),
				array( 'wp-element', 'wp-api-fetch', 'wp-data', 'wp-components', 'wp-i18n' )
			),
			$admin_asset['version'] ?? GUTENX_VERSION,
			true
		);

		// Enqueue admin styles.
		$admin_css_path = trailingslashit( GUTENX_DIR ) . 'build/admin.css';
		if ( file_exists( $admin_css_path ) ) {
			wp_enqueue_style(
				'gutenx-admin',
				trailingslashit( GUTENX_URL ) . 'build/admin.css',
				array( 'wp-components' ),
				$admin_asset['version'] ?? GUTENX_VERSION
			);
		}

		// Localize script with REST API config.
		wp_localize_script(
			'gutenx-admin',
			'gutenxAdminData',
			array(
				'nonce'   => wp_create_nonce( 'wp_rest' ),
				'apiUrl'  => esc_url_raw( rest_url( 'gutenx/v1/' ) ),
				'siteUrl' => esc_url( get_site_url() ),
				'version' => GUTENX_VERSION,
			)
		);

		// Set script translations for i18n.
		wp_set_script_translations( 'gutenx-admin', 'gutenx-blocks' );
	}

	/**
	 * Render the admin page container.
	 *
	 * Outputs the root div that React mounts into.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render_page(): void {
		echo '<div class="wrap"><div id="gutenx-admin-root"></div></div>';
	}
}
