<?php
/**
 * Block Loader
 *
 * Conditionally registers blocks based on admin settings.
 * Reads block states from gutenx_block_states option.
 *
 * @package GutenX_Blocks\Blocks
 * @since   1.0.0
 */

namespace GutenX_Blocks\Blocks;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Block_Loader
 *
 * @since 1.0.0
 */
class Block_Loader {

	/**
	 * All available block slugs.
	 *
	 * @var array
	 */
	private array $block_slugs = array(
		'advanced-heading',
		'advanced-button',
		'container',
		'row',
		'icon-box',
		'testimonial',
		'image-gallery',
	);

	/**
	 * Register all enabled blocks.
	 *
	 * Reads the gutenx_block_states option and registers
	 * only blocks that are enabled.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_blocks(): void {
		$enabled_blocks = $this->get_enabled_blocks();

		foreach ( $this->block_slugs as $slug ) {
			$full_name = 'gutenx-blocks/' . $slug;

			// Only register if enabled.
			if ( isset( $enabled_blocks[ $full_name ] ) && $enabled_blocks[ $full_name ] ) {
				$block_dir = trailingslashit( GUTENX_DIR ) . 'build/blocks/' . $slug;

				if ( file_exists( $block_dir . '/block.json' ) ) {
					register_block_type( $block_dir );
				}
			}
		}

		// PRO_HOOK: Allow pro plugin to register additional blocks.
		do_action( 'gutenx_register_pro_blocks' );
	}

	/**
	 * Get enabled block states from database.
	 *
	 * @since 1.0.0
	 *
	 * @return array Associative array of block name => enabled boolean.
	 */
	private function get_enabled_blocks(): array {
		$defaults = array();
		foreach ( $this->block_slugs as $slug ) {
			$defaults[ 'gutenx-blocks/' . $slug ] = true;
		}

		$saved = get_option( 'gutenx_block_states', $defaults );

		if ( ! is_array( $saved ) ) {
			return $defaults;
		}

		return array_merge( $defaults, $saved );
	}

	/**
	 * Enqueue shared block editor assets.
	 *
	 * Registers the shared editor CSS and JS used across all blocks.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_block_assets(): void {
		$editor_asset_path = trailingslashit( GUTENX_DIR ) . 'build/editor.asset.php';
		$editor_asset      = file_exists( $editor_asset_path )
			? require $editor_asset_path
			: array(
				'dependencies' => array(),
				'version'      => GUTENX_VERSION,
			);

		// Enqueue shared editor script.
		$editor_js_path = trailingslashit( GUTENX_DIR ) . 'build/editor.js';
		if ( file_exists( $editor_js_path ) ) {
			wp_enqueue_script(
				'gutenx-editor',
				trailingslashit( GUTENX_URL ) . 'build/editor.js',
				$editor_asset['dependencies'] ?? array(),
				$editor_asset['version'] ?? GUTENX_VERSION,
				true
			);

			wp_set_script_translations( 'gutenx-editor', 'gutenx-blocks' );
		}

		// Enqueue shared editor styles.
		$editor_css_path = trailingslashit( GUTENX_DIR ) . 'build/editor.css';
		if ( file_exists( $editor_css_path ) ) {
			wp_enqueue_style(
				'gutenx-editor',
				trailingslashit( GUTENX_URL ) . 'build/editor.css',
				array( 'wp-edit-blocks' ),
				$editor_asset['version'] ?? GUTENX_VERSION
			);
		}
	}

	/**
	 * Add custom block category.
	 *
	 * Adds the "GutenX Blocks" category to the block inserter.
	 *
	 * @since 1.0.0
	 *
	 * @param array                    $categories Existing block categories.
	 * @param \WP_Block_Editor_Context $context    Block editor context.
	 *
	 * @return array Modified categories array.
	 */
	public function get_block_categories( array $categories, $context ): array {
		// Add GutenX category at the beginning.
		array_unshift(
			$categories,
			array(
				'slug'  => 'gutenx-blocks',
				'title' => __( 'GutenX Blocks', 'gutenx-blocks' ),
				'icon'  => 'layout',
			)
		);

		return $categories;
	}
}
