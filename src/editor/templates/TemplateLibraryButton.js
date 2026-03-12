/**
 * TemplateLibraryButton — Toolbar Button to Open Template Library
 *
 * Registers a plugin in the block editor toolbar using
 * @wordpress/plugins to add a button that opens the template modal.
 *
 * @package GutenX_Blocks
 */

import { useState, useEffect, createPortal } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import TemplateLibrary from './TemplateLibrary';

/**
 * Portal component to inject button into Gutenberg toolbar
 */
const TopToolbarButton = ( { onClick } ) => {
	const [ container, setContainer ] = useState( null );

	useEffect( () => {
		// Poll until the Gutenberg header toolbar is available in the DOM.
		const timer = setInterval( () => {
			const toolbar = document.querySelector( '.edit-post-header__toolbar' ) || 
			                document.querySelector( '.edit-post-header-toolbar' );
			
			if ( toolbar ) {
				clearInterval( timer );
				
				let btnContainer = document.getElementById( 'gutenx-template-button-container' );
				if ( ! btnContainer ) {
					btnContainer = document.createElement( 'div' );
					btnContainer.id = 'gutenx-template-button-container';
					// Insert right after the 'List View' toggle usually
					toolbar.appendChild( btnContainer );
				}
				setContainer( btnContainer );
			}
		}, 500 );
		
		return () => clearInterval( timer );
	}, [] );

	if ( ! container ) {
		return null;
	}

	return createPortal(
		<Button
			className="gutenx-template-library-btn"
			onClick={ onClick }
			style={ { 
				display: 'inline-flex', 
				alignItems: 'center',
				padding: '0 12px',
				height: '36px',
				marginLeft: '8px', 
				border: '1px solid var(--wp-admin-theme-color, #3858E9)',
				color: 'var(--wp-admin-theme-color, #3858E9)',
				borderRadius: '4px',
				fontWeight: '500',
				background: 'transparent',
				cursor: 'pointer'
			} }
		>
			<span style={ { fontWeight: 'bold', marginRight: '6px', fontSize: '16px' } }>B</span>
			{ __( 'Template Library', 'gutenx-blocks' ) }
		</Button>,
		container
	);
};

/**
 * GutenXTemplateButton plugin component.
 */
const GutenXTemplateButton = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<>
			<TopToolbarButton onClick={ () => setIsOpen( true ) } />
			<TemplateLibrary
				isOpen={ isOpen }
				onClose={ () => setIsOpen( false ) }
			/>
		</>
	);
};

// Register the plugin.
registerPlugin( 'gutenx-template-library', {
	render: GutenXTemplateButton,
} );

export default GutenXTemplateButton;
