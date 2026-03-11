/**
 * useTemplateInsert — Hook for inserting template blocks
 *
 * Converts template data arrays into WordPress blocks and
 * inserts them into the editor.
 *
 * @package GutenX_Blocks
 */

import { useState, useCallback } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Recursively convert template array format to WordPress blocks.
 *
 * @param {Array} templateBlocks Array of [ blockName, attributes, innerBlocks ] tuples.
 * @return {Array} Array of WordPress block objects.
 */
const convertTemplateToBlocks = ( templateBlocks ) => {
	return templateBlocks.map( ( blockDef ) => {
		const [ name, attributes = {}, innerBlocksDef = [] ] = blockDef;
		const innerBlocks = innerBlocksDef.length > 0
			? convertTemplateToBlocks( innerBlocksDef )
			: [];
		return createBlock( name, attributes, innerBlocks );
	} );
};

/**
 * useTemplateInsert hook.
 *
 * @return {Object} { insertTemplate, isInserting }
 */
const useTemplateInsert = () => {
	const [ isInserting, setIsInserting ] = useState( false );
	const { insertBlocks } = useDispatch( 'core/block-editor' );

	const insertTemplate = useCallback(
		( template ) => {
			setIsInserting( true );

			try {
				const blocks = convertTemplateToBlocks( template.blocks );
				insertBlocks( blocks );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( 'GutenX: Failed to insert template:', error );
			} finally {
				setIsInserting( false );
			}
		},
		[ insertBlocks ]
	);

	return { insertTemplate, isInserting };
};

export default useTemplateInsert;
