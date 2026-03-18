<?php
/**
 * GutenX Blocks Uninstall
 *
 * Fires when the plugin is uninstalled (deleted via WP admin).
 * Removes all plugin options from the database.
 *
 * @package GutenX_Blocks
 */

// Security check — only run during uninstall.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Delete plugin options.
delete_option( 'gutenx_settings' );
delete_option( 'gutenx_block_states' );
