/**
 * Header Component
 *
 * Plugin branding header with name, version, and docs link.
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const Header = () => {
	const version = window.gutenxAdminData?.version || '1.0.0';

	return (
		<div className="gutenx-header">
			<div className="gutenx-header__brand">
				<span className="gutenx-header__icon">⚡</span>
				<h1 className="gutenx-header__title">
					{ __( 'GutenX Blocks', 'gutenx-blocks' ) }
				</h1>
				<span className="gutenx-header__version">
					{ `v${ version }` }
				</span>
			</div>
			<div className="gutenx-header__actions">
				<p className="gutenx-header__tagline">
					{ __( 'Manage which blocks are active in your editor', 'gutenx-blocks' ) }
				</p>
				<Button
					variant="secondary"
					href="https://gutenxblocks.com/docs"
					target="_blank"
					rel="noopener noreferrer"
					className="gutenx-header__docs-btn"
				>
					{ __( 'Documentation', 'gutenx-blocks' ) }
				</Button>
			</div>
		</div>
	);
};

export default Header;
