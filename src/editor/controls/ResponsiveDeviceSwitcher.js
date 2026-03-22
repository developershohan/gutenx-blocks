/**
 * ResponsiveDeviceSwitcher — Reusable Device Toggle
 *
 * Provides desktop / tablet / mobile icon buttons that sync
 * with Gutenberg's editor preview. Drop this into any panel
 * that needs responsive controls.
 *
 * Usage:
 *   import { ResponsiveDeviceSwitcher, useDeviceType } from '../../editor/controls';
 *
 *   const MyPanel = ( { attributes, setAttributes } ) => {
 *       const { selectedDevice, setDevice } = useDeviceType();
 *       return (
 *           <div className="my-header">
 *               <span>Font Size</span>
 *               <ResponsiveDeviceSwitcher
 *                   selectedDevice={ selectedDevice }
 *                   onChange={ setDevice }
 *               />
 *           </div>
 *       );
 *   };
 *
 * @package GutenX_Blocks
 */

import { useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/* ─── Constants ─── */

export const DEVICES = [
	{ slug: 'desktop', gutenberg: 'Desktop' },
	{ slug: 'tablet', gutenberg: 'Tablet' },
	{ slug: 'mobile', gutenberg: 'Mobile' },
];

/* ─── SVG Icons ─── */

const DesktopIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
		<path d="M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6l-2 3v1h8v-1l-2-3h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z" />
	</svg>
);

const TabletIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
		<path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z" />
	</svg>
);

const MobileIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
		<path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5S10.67 19 11.5 19s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
	</svg>
);

const DEVICE_ICONS = { desktop: DesktopIcon, tablet: TabletIcon, mobile: MobileIcon };

/* ─── Helpers ─── */

/**
 * Dispatch device type to Gutenberg editor preview.
 *
 * This syncs the editor canvas (responsive preview) whenever
 * the user clicks a device icon in any panel.
 */
export const syncEditorDevice = ( gutenbergDevice ) => {
	try {
		const d = wp.data.dispatch( 'core/editor' );
		if ( typeof d.setDeviceType === 'function' ) {
			d.setDeviceType( gutenbergDevice );
			return;
		}
	} catch ( e ) { /* fallback */ }
	try {
		const d = wp.data.dispatch( 'core/edit-post' );
		if ( typeof d.__experimentalSetPreviewDeviceType === 'function' ) {
			d.__experimentalSetPreviewDeviceType( gutenbergDevice );
		}
	} catch ( e ) { /* silent */ }
};

/* ─── useDeviceType Hook ─── */

/**
 * Custom hook that reads the current device from Gutenberg's
 * editor store and provides a setter that syncs back.
 *
 * @return {{ selectedDevice: string, setDevice: Function }}
 */
export const useDeviceType = () => {
	// Read the current device from Gutenberg's store.
	const editorDevice = useSelect( ( select ) => {
		try {
			const es = select( 'core/editor' );
			if ( typeof es.getDeviceType === 'function' ) {
				return es.getDeviceType();
			}
		} catch ( e ) { /* fallback */ }
		try {
			const eps = select( 'core/edit-post' );
			if ( typeof eps.__experimentalGetPreviewDeviceType === 'function' ) {
				return eps.__experimentalGetPreviewDeviceType();
			}
		} catch ( e ) { /* silent */ }
		return 'Desktop';
	}, [] );

	const deviceMap = { Desktop: 'desktop', Tablet: 'tablet', Mobile: 'mobile' };
	const selectedDevice = deviceMap[ editorDevice ] || 'desktop';

	const setDevice = useCallback( ( device ) => {
		const entry = DEVICES.find( ( d ) => d.slug === device );
		if ( entry ) {
			syncEditorDevice( entry.gutenberg );
		}
	}, [] );

	return { selectedDevice, setDevice };
};

/* ─── ResponsiveDeviceSwitcher Component ─── */

/**
 * Renders desktop / tablet / mobile icon buttons.
 *
 * @param {Object}   props                Component props.
 * @param {string}   props.selectedDevice  Current device slug ('desktop'|'tablet'|'mobile').
 * @param {Function} props.onChange        Callback when a device button is clicked.
 * @return {JSX.Element}
 */
const ResponsiveDeviceSwitcher = ( { selectedDevice, onChange } ) => {
	return (
		<div className="gutenx-device-buttons">
			{ DEVICES.map( ( d ) => {
				const Icon = DEVICE_ICONS[ d.slug ];
				return (
					<button
						key={ d.slug }
						className={ `gutenx-device-btn${ selectedDevice === d.slug ? ' is-active' : '' }` }
						onClick={ () => onChange( d.slug ) }
						title={ d.gutenberg }
						type="button"
					>
						<Icon />
					</button>
				);
			} ) }
		</div>
	);
};

export default ResponsiveDeviceSwitcher;
