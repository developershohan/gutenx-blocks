/**
 * TemplateLibraryButton — Toolbar Button to Open Template Library
 *
 * Registers a plugin in the block editor toolbar using
 * @wordpress/plugins to add a button that opens the template modal.
 *
 * @package GutenX_Blocks
 */

import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginBlockSettingsMenuItem } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import TemplateLibrary from './TemplateLibrary';

/**
 * GutenXTemplateButton plugin component.
 */
const GutenXTemplateButton = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<>
			<PluginBlockSettingsMenuItem
				icon="layout"
				label={ __( 'GutenX Templates', 'gutenx-blocks' ) }
				onClick={ () => setIsOpen( true ) }
			/>
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
	icon: 'layout',
} );

export default GutenXTemplateButton;
