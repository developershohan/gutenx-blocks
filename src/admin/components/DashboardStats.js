/**
 * DashboardStats Component
 *
 * Displays three stat cards: Total, Enabled, and Disabled blocks.
 *
 * @package GutenX_Blocks
 */

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { STORE_NAME } from '../store';

const DashboardStats = () => {
	const blocks = useSelect( ( select ) => select( STORE_NAME ).getBlocks(), [] );

	const entries = Object.entries( blocks );
	const total = entries.length;
	const enabled = entries.filter( ( [ , val ] ) => val ).length;
	const disabled = total - enabled;

	return (
		<div className="gutenx-stats">
			<div className="gutenx-stats__card">
				<span className="gutenx-stats__number">{ total }</span>
				<span className="gutenx-stats__label">
					{ __( 'Total Blocks', 'gutenx-blocks' ) }
				</span>
			</div>
			<div className="gutenx-stats__card gutenx-stats__card--enabled">
				<span className="gutenx-stats__number">{ enabled }</span>
				<span className="gutenx-stats__label">
					{ __( 'Enabled', 'gutenx-blocks' ) }
				</span>
			</div>
			<div className="gutenx-stats__card gutenx-stats__card--disabled">
				<span className="gutenx-stats__number">{ disabled }</span>
				<span className="gutenx-stats__label">
					{ __( 'Disabled', 'gutenx-blocks' ) }
				</span>
			</div>
		</div>
	);
};

export default DashboardStats;
