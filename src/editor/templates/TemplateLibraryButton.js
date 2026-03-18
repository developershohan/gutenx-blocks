/**
 * TemplateLibraryButton — Toolbar Button to Open Template Library
 *
 * Injects a button directly into the Gutenberg top toolbar using a React Portal.
 *
 * @package GutenX_Blocks
 */

import { useState, useEffect, createPortal } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import TemplateLibrary from './TemplateLibrary';

/**
 * GutenXTemplateButton plugin component.
 * Uses pure Vanilla JS to mount the button into the toolbar to prevent React 
 * from panicking and re-rendering the entire Gutenberg header (which triggers
 * the "Choose a pattern" modal loop).
 */
const GutenXTemplateButton = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	useEffect( () => {
		let observer;
		
		const mountButton = () => {
			const toolbar = document.querySelector( '.edit-post-header__toolbar' ) || 
			                document.querySelector( '.edit-post-header-toolbar' );
			
			if ( toolbar && ! document.getElementById( 'gutenx-template-button-vanilla' ) ) {
				const btn = document.createElement( 'button' );
				btn.id = 'gutenx-template-button-vanilla';
				btn.className = 'components-button';
				btn.style.display = 'inline-flex';
				btn.style.alignItems = 'center';
				btn.style.padding = '0 12px';
				btn.style.height = '36px';
				btn.style.marginLeft = '8px';
				btn.style.border = '1px solid var(--wp-admin-theme-color, #3858E9)';
				btn.style.color = 'var(--wp-admin-theme-color, #3858E9)';
				btn.style.borderRadius = '4px';
				btn.style.fontWeight = '500';
				btn.style.background = 'transparent';
				btn.style.cursor = 'pointer';
				
				btn.innerHTML = '<span style="font-weight: bold; margin-right: 6px; font-size: 16px;">B</span> Template Library';
				btn.onclick = () => setIsOpen( true );

				toolbar.appendChild( btn );
			}
		};

		// Use a MutationObserver to instantly inject the button any time React/Gutenberg
		// redraws the DOM, completely removing the artificial 1-second "blinking" delay.
		observer = new MutationObserver( () => {
			// Throttle slightly with requestAnimationFrame to prevent layout thrashing
			window.requestAnimationFrame( mountButton );
		} );

		// Watch the whole body for fast structural DOM changes
		observer.observe( document.body, { childList: true, subtree: true } );
		
		// Initial mount attempts
		mountButton();

		return () => {
			if ( observer ) {
				observer.disconnect();
			}
			const btnNode = document.getElementById( 'gutenx-template-button-vanilla' );
			if ( btnNode && btnNode.parentNode ) {
				btnNode.parentNode.removeChild( btnNode );
			}
		};
	}, [] );

	return (
		<TemplateLibrary
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
		/>
	);
};

// Register the plugin.
registerPlugin( 'gutenx-template-library', {
	render: GutenXTemplateButton,
} );

export default GutenXTemplateButton;
