<?php
/**
 * REST Controller
 *
 * Registers and handles REST API endpoints for GutenX Blocks.
 * Namespace: /wp-json/gutenx/v1/
 *
 * @package GutenX_Blocks\API
 * @since   1.0.0
 */

namespace GutenX_Blocks\API;

use GutenX_Blocks\Traits\Validation_Trait;
use GutenX_Blocks\Traits\Sanitization_Trait;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class REST_Controller
 *
 * Provides REST endpoints for plugin settings and block management.
 *
 * @since 1.0.0
 */
class REST_Controller {

	use Validation_Trait;
	use Sanitization_Trait;

	/**
	 * REST API namespace.
	 *
	 * @var string
	 */
	private string $namespace = 'gutenx/v1';

	/**
	 * Register all REST routes.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_routes(): void {
		// GET /wp-json/gutenx/v1/settings
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'settings_permissions_check' ),
				),
			)
		);

		// POST /wp-json/gutenx/v1/settings
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'save_settings' ),
					'permission_callback' => array( $this, 'settings_permissions_check' ),
					'args'                => array(
						'blocks' => array(
							'type'              => 'object',
							'required'          => true,
							'description'       => __( 'Block states object with slug => enabled boolean pairs.', 'gutenx-blocks' ),
							'sanitize_callback' => function ( $value ) {
								return $this->sanitize_settings( (array) $value );
							},
						),
					),
				),
			)
		);

		// GET /wp-json/gutenx/v1/blocks
		register_rest_route(
			$this->namespace,
			'/blocks',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_blocks' ),
					'permission_callback' => array( $this, 'blocks_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Permission callback for settings endpoints.
	 *
	 * Requires the user to be logged in and have manage_options capability.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return bool|\WP_Error True if the request has permission, WP_Error otherwise.
	 */
	public function settings_permissions_check( \WP_REST_Request $request ) {
		if ( ! is_user_logged_in() ) {
			return new \WP_Error(
				'rest_not_logged_in',
				__( 'You must be logged in to access this endpoint.', 'gutenx-blocks' ),
				array( 'status' => 401 )
			);
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to manage settings.', 'gutenx-blocks' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Permission callback for blocks endpoint.
	 *
	 * Requires the user to be logged in.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return bool|\WP_Error True if the request has permission, WP_Error otherwise.
	 */
	public function blocks_permissions_check( \WP_REST_Request $request ) {
		if ( ! is_user_logged_in() ) {
			return new \WP_Error(
				'rest_not_logged_in',
				__( 'You must be logged in to access this endpoint.', 'gutenx-blocks' ),
				array( 'status' => 401 )
			);
		}

		return true;
	}

	/**
	 * GET /settings — Retrieve plugin settings.
	 *
	 * Returns block states and plugin version.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response Response object.
	 */
	public function get_settings( \WP_REST_Request $request ): \WP_REST_Response {
		$block_states = get_option( 'gutenx_block_states', $this->get_default_block_states() );

		return new \WP_REST_Response(
			array(
				'blocks'  => $block_states,
				'version' => GUTENX_VERSION,
			),
			200
		);
	}

	/**
	 * POST /settings — Save plugin settings.
	 *
	 * Sanitizes and persists block enable/disable states.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response Response object.
	 */
	public function save_settings( \WP_REST_Request $request ): \WP_REST_Response {
		$blocks = $request->get_param( 'blocks' );

		if ( ! is_array( $blocks ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => __( 'Invalid blocks data.', 'gutenx-blocks' ),
				),
				400
			);
		}

		// Sanitize the block states.
		$sanitized_blocks = $this->sanitize_settings( $blocks );

		// Merge with defaults to ensure all blocks have a state.
		$default_states = $this->get_default_block_states();
		$merged_blocks  = array_merge( $default_states, $sanitized_blocks );

		// Save to database.
		update_option( 'gutenx_block_states', $merged_blocks );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'saved'   => $merged_blocks,
				'message' => __( 'Settings saved successfully.', 'gutenx-blocks' ),
			),
			200
		);
	}

	/**
	 * GET /blocks — Retrieve registered block info.
	 *
	 * Returns block names, labels, and their enabled status.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \WP_REST_Response Response object.
	 */
	public function get_blocks( \WP_REST_Request $request ): \WP_REST_Response {
		$block_states = get_option( 'gutenx_block_states', $this->get_default_block_states() );

		$block_labels = array(
			'gutenx-blocks/advanced-heading' => __( 'Advanced Heading', 'gutenx-blocks' ),
			'gutenx-blocks/advanced-button'  => __( 'Advanced Button', 'gutenx-blocks' ),
			'gutenx-blocks/container'        => __( 'Container', 'gutenx-blocks' ),
			'gutenx-blocks/row'              => __( 'Row', 'gutenx-blocks' ),
			'gutenx-blocks/icon-box'         => __( 'Icon Box', 'gutenx-blocks' ),
			'gutenx-blocks/testimonial'      => __( 'Testimonial', 'gutenx-blocks' ),
			'gutenx-blocks/image-gallery'    => __( 'Image Gallery', 'gutenx-blocks' ),
		);

		$blocks_data = array();
		foreach ( $block_states as $slug => $enabled ) {
			$blocks_data[] = array(
				'name'    => esc_html( $slug ),
				'label'   => isset( $block_labels[ $slug ] ) ? esc_html( $block_labels[ $slug ] ) : esc_html( $slug ),
				'enabled' => (bool) $enabled,
			);
		}

		// PRO_HOOK: apply_filters to allow pro blocks to register.
		$blocks_data = apply_filters( 'gutenx_registered_blocks', $blocks_data );

		return new \WP_REST_Response(
			array(
				'blocks' => $blocks_data,
			),
			200
		);
	}

	/**
	 * Get default block states.
	 *
	 * All 7 blocks are enabled by default.
	 *
	 * @since 1.0.0
	 *
	 * @return array Default block states.
	 */
	private function get_default_block_states(): array {
		return array(
			'gutenx-blocks/advanced-heading' => true,
			'gutenx-blocks/advanced-button'  => true,
			'gutenx-blocks/container'        => true,
			'gutenx-blocks/row'              => true,
			'gutenx-blocks/icon-box'         => true,
			'gutenx-blocks/testimonial'      => true,
			'gutenx-blocks/image-gallery'    => true,
		);
	}
}
