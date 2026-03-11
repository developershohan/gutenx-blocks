/**
 * InspectorTabs — Tabbed Inspector Controls Wrapper
 *
 * Provides General / Style / Advanced tabs in the InspectorControls sidebar.
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

/**
 * Tab definitions.
 */
const TABS = [
	{
		name: 'general',
		title: __( 'General', 'gutenx-blocks' ),
		className: 'gutenx-tab gutenx-tab--general',
	},
	{
		name: 'style',
		title: __( 'Style', 'gutenx-blocks' ),
		className: 'gutenx-tab gutenx-tab--style',
	},
	{
		name: 'advanced',
		title: __( 'Advanced', 'gutenx-blocks' ),
		className: 'gutenx-tab gutenx-tab--advanced',
	},
];

/**
 * InspectorTabs component.
 *
 * @param {Object}      props             Component props.
 * @param {JSX.Element} props.generalTab  Content for the General tab.
 * @param {JSX.Element} props.styleTab    Content for the Style tab.
 * @param {JSX.Element} props.advancedTab Content for the Advanced tab.
 * @return {JSX.Element} Tabbed inspector UI.
 */
const InspectorTabs = ( { generalTab, styleTab, advancedTab } ) => {
	return (
		<InspectorControls>
			<TabPanel
				className="gutenx-inspector-tabs"
				tabs={ TABS }
				initialTabName="general"
			>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'general':
							return (
								<div className="gutenx-inspector-tabs__content">
									{ generalTab }
								</div>
							);
						case 'style':
							return (
								<div className="gutenx-inspector-tabs__content">
									{ styleTab }
									{ /* PRO_HOOK: do_action("gutenx_pro_controls") */ }
								</div>
							);
						case 'advanced':
							return (
								<div className="gutenx-inspector-tabs__content">
									{ advancedTab }
								</div>
							);
						default:
							return null;
					}
				} }
			</TabPanel>
		</InspectorControls>
	);
};

export default InspectorTabs;
