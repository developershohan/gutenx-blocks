<?php
/**
 * Sanitization Trait
 *
 * Provides input sanitization methods for use across the plugin.
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
 * Trait Sanitization_Trait
 *
 * @since 1.0.0
 */
trait Sanitization_Trait {

	/**
	 * Sanitize a text string.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return string Sanitized text string.
	 */
	public function sanitize_text( mixed $value ): string {
		return sanitize_text_field( (string) $value );
	}

	/**
	 * Sanitize HTML content, allowing safe tags.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The HTML content to sanitize.
	 *
	 * @return string Sanitized HTML string.
	 */
	public function sanitize_html( mixed $value ): string {
		return wp_kses_post( (string) $value );
	}

	/**
	 * Sanitize a URL.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The URL to sanitize.
	 *
	 * @return string Sanitized URL string.
	 */
	public function sanitize_url( mixed $value ): string {
		return esc_url_raw( (string) $value );
	}

	/**
	 * Sanitize and cast a value to boolean.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return bool Sanitized boolean.
	 */
	public function sanitize_bool( mixed $value ): bool {
		return (bool) filter_var( $value, FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Sanitize an associative array of boolean values.
	 *
	 * Keys are sanitized as text, values as booleans.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data The associative array to sanitize.
	 *
	 * @return array Sanitized array with text keys and boolean values.
	 */
	public function sanitize_array_of_bools( array $data ): array {
		$sanitized = array();
		foreach ( $data as $key => $value ) {
			$clean_key               = sanitize_text_field( (string) $key );
			$sanitized[ $clean_key ] = $this->sanitize_bool( $value );
		}
		return $sanitized;
	}

	/**
	 * Sanitize the block settings data.
	 *
	 * Expects an array of block slugs => boolean (enabled/disabled).
	 *
	 * @since 1.0.0
	 *
	 * @param array $data The settings data to sanitize.
	 *
	 * @return array Sanitized settings array.
	 */
	public function sanitize_settings( array $data ): array {
		return $this->sanitize_array_of_bools( $data );
	}
}
