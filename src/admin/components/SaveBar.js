/**
 * SaveBar Component
 *
 * Sticky bottom bar with the Save Settings button.
 *
 * @package GutenX_Blocks
 */

import { useSelect, useDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { STORE_NAME } from '../store';

const SaveBar = () => {
	const { blocks, isSaving } = useSelect( ( select ) => ( {
		blocks: select( STORE_NAME ).getBlocks(),
		isSaving: select( STORE_NAME ).getIsSaving(),
	} ) );

	const { saveSettings } = useDispatch( STORE_NAME );

	const handleSave = () => {
		saveSettings( blocks );
	};

	return (
		<div className="gutenx-savebar">
			<span className="gutenx-savebar__label">
				{ __( 'GutenX Blocks Settings', 'gutenx-blocks' ) }
			</span>
			<Button
				variant="primary"
				onClick={ handleSave }
				isBusy={ isSaving }
				disabled={ isSaving }
				className="gutenx-savebar__btn"
			>
				{ isSaving
					? __( 'Saving…', 'gutenx-blocks' )
					: __( 'Save Settings', 'gutenx-blocks' ) }
			</Button>
		</div>
	);
};

export default SaveBar;
