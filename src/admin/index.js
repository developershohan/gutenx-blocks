/**
 * GutenX Blocks — Admin SPA Entry Point
 *
 * Renders the React admin dashboard into the #gutenx-admin-root element.
 *
 * @package GutenX_Blocks
 */

import { createRoot } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import App from './App';
import './store';
import './style.scss';

// Configure apiFetch with REST nonce.
if ( window.gutenxAdminData?.nonce ) {
	apiFetch.use( apiFetch.createNonceMiddleware( window.gutenxAdminData.nonce ) );
}

// Render the admin app.
document.addEventListener( 'DOMContentLoaded', () => {
	const root = document.getElementById( 'gutenx-admin-root' );
	if ( root ) {
		createRoot( root ).render( <App /> );
	}
} );
