<?php
/**
 * Validation Trait
 *
 * Provides nonce verification and capability checking methods
 * for REST endpoints and AJAX handlers.
 *
 * @package GutenX_Blocks\Traits
 * @since   1.0.0
 */

namespace GutenX_Blocks\Traits;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Trait Validation_Trait
 *
 * @since 1.0.0
 */
trait Validation_Trait {

	/**
	 * Verify a nonce value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $nonce  The nonce value to verify.
	 * @param string $action The nonce action name.
	 *
	 * @return bool True if valid, false otherwise.
	 */
	public function verify_nonce( string $nonce, string $action ): bool {
		if ( ! wp_verify_nonce( $nonce, $action ) ) {
			wp_send_json_error(
				array( 'message' => __( 'Security verification failed.', 'gutenx-blocks' ) ),
				403
			);
			return false;
		}
		return true;
	}

	/**
	 * Check if the current user has a specific capability.
	 *
	 * @since 1.0.0
	 *
	 * @param string $cap The capability to check. Default 'manage_options'.
	 *
	 * @return bool True if the user has the capability, false otherwise.
	 */
	public function check_capability( string $cap = 'manage_options' ): bool {
		if ( ! current_user_can( $cap ) ) {
			wp_send_json_error(
				array( 'message' => __( 'You do not have permission to perform this action.', 'gutenx-blocks' ) ),
				403
			);
			return false;
		}
		return true;
	}

	/**
	 * Validate REST API nonce from the request.
	 *
	 * Checks the X-WP-Nonce header for REST API authentication.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return bool|\WP_Error True if valid, WP_Error on failure.
	 */
	public function validate_rest_nonce( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );

		if ( empty( $nonce ) || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'REST API nonce verification failed.', 'gutenx-blocks' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}
}
