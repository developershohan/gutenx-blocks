/**
 * SpacingPanel — Margin & Padding Controls
 *
 * Compact horizontal layout with icon-based device switcher,
 * per-field unit selectors, and link/unlink chain icon.
 *
 * @package
 */

import { PanelBody, Popover } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ResponsiveDeviceSwitcher, { useDeviceType, DEVICES } from './ResponsiveDeviceSwitcher';

/* ─── Constants ─── */

const UNITS = [ 'px', '%', 'em', 'rem', 'vw', 'vh' ];

const DEFAULTS = {
	marginTop: '0px',
	marginRight: '0px',
	marginBottom: '0px',
	marginLeft: '0px',
	paddingTop: '16px',
	paddingRight: '16px',
	paddingBottom: '16px',
	paddingLeft: '16px',
};

const SIDES = [ 'Top', 'Right', 'Bottom', 'Left' ];

/* ─── SVG Icons ─── */

const LinkIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
		<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
	</svg>
);

const UnlinkIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
		<path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4.01 1.41-1.41L3.41 2.86 2 4.27z" />
	</svg>
);

/* ─── Helpers ─── */

/**
 * Parse "16px" → { num: "16", unit: "px" }.
 */
const parseValueAndUnit = ( value ) => {
	if ( ! value || value === '' ) {
		return { num: '', unit: 'px' };
	}
	const str = String( value ).trim();
	const match = str.match( /^(-?\d*\.?\d+)\s*(px|rem|em|%|vw|vh)?$/ );
	if ( match ) {
		return { num: match[ 1 ], unit: match[ 2 ] || 'px' };
	}
	return { num: str, unit: 'px' };
};

const getDeviceSuffix = ( device ) =>
	device === 'desktop' ? '' : `${ device.charAt( 0 ).toUpperCase() }${ device.slice( 1 ) }`;

const getAttrName = ( type, side, device ) =>
	`${ type }${ side }${ getDeviceSuffix( device ) }`;

const getCurrentValue = ( attributes, type, side, device ) => {
	const attrKey = getAttrName( type, side, device );
	const desktopKey = getAttrName( type, side, 'desktop' );
	if ( device === 'desktop' ) {
		return attributes[ attrKey ] || DEFAULTS[ `${ type }${ side }` ];
	}
	if ( device === 'tablet' ) {
		return attributes[ attrKey ] || attributes[ desktopKey ] || DEFAULTS[ `${ type }${ side }` ];
	}
	// mobile → tablet → desktop fallback
	const tabletKey = getAttrName( type, side, 'tablet' );
	return attributes[ attrKey ] || attributes[ tabletKey ] || attributes[ desktopKey ] || DEFAULTS[ `${ type }${ side }` ];
};

/* ─── UnitDropdown ─── */

const UnitDropdown = ( { currentUnit, onChange } ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const btnRef = useRef();

	return (
		<div className="gutenx-unit-selector">
			<button
				ref={ btnRef }
				className="gutenx-unit-btn"
				onClick={ () => setIsOpen( ! isOpen ) }
				type="button"
			>
				{ currentUnit.toUpperCase() }
			</button>
			{ isOpen && (
				<Popover
					anchor={ btnRef.current }
					position="bottom center"
					onClose={ () => setIsOpen( false ) }
					className="gutenx-unit-popover"
					focusOnMount="container"
				>
					<div className="gutenx-unit-options">
						{ UNITS.map( ( u ) => (
							<button
								key={ u }
								className={ `gutenx-unit-option${ u === currentUnit ? ' is-active' : '' }` }
								onClick={ () => {
									onChange( u );
									setIsOpen( false );
								} }
								type="button"
							>
								{ u }
							</button>
						) ) }
					</div>
				</Popover>
			) }
		</div>
	);
};

/* ─── SpacingSection (Margin or Padding) ─── */

const SpacingSection = ( {
	type,
	label,
	attributes,
	setAttributes,
	selectedDevice,
	setDevice,
	linked,
	onToggleLink,
} ) => {
	const updateSideValue = ( side, rawValue, unit ) => {
		const numStr = rawValue === '' ? '' : String( parseFloat( rawValue ) || 0 );
		const formatted = numStr === '' ? '' : `${ numStr }${ unit }`;
		const affectedSides = linked ? SIDES : [ side ];
		const updates = {};

		// Apply to all affected sides for current device.
		affectedSides.forEach( ( s ) => {
			updates[ getAttrName( type, s, selectedDevice ) ] = formatted;
		} );

		// Cascade down: desktop → tablet + mobile, tablet → mobile.
		if ( selectedDevice === 'desktop' ) {
			affectedSides.forEach( ( s ) => {
				const dKey = getAttrName( type, s, 'desktop' );
				const tKey = getAttrName( type, s, 'tablet' );
				const mKey = getAttrName( type, s, 'mobile' );
				const dOld = attributes[ dKey ] || DEFAULTS[ `${ type }${ s }` ];
				const tOld = attributes[ tKey ] || dOld;
				const mOld = attributes[ mKey ] || tOld;

				if ( tOld === dOld ) {
					updates[ tKey ] = formatted;
				}
				if ( mOld === dOld || mOld === tOld ) {
					updates[ mKey ] = formatted;
				}
			} );
		} else if ( selectedDevice === 'tablet' ) {
			affectedSides.forEach( ( s ) => {
				const tKey = getAttrName( type, s, 'tablet' );
				const mKey = getAttrName( type, s, 'mobile' );
				const tOld = attributes[ tKey ] ||
					attributes[ getAttrName( type, s, 'desktop' ) ] ||
					DEFAULTS[ `${ type }${ s }` ];
				const mOld = attributes[ mKey ] || tOld;

				if ( mOld === tOld ) {
					updates[ mKey ] = formatted;
				}
			} );
		}
		// mobile → no cascade

		setAttributes( updates );
	};

	const onValueChange = ( side, rawValue ) => {
		const cur = getCurrentValue( attributes, type, side, selectedDevice );
		const { unit } = parseValueAndUnit( cur );
		updateSideValue( side, rawValue, unit );
	};

	const onUnitChange = ( side, newUnit ) => {
		const cur = getCurrentValue( attributes, type, side, selectedDevice );
		const { num } = parseValueAndUnit( cur );
		updateSideValue( side, num || '0', newUnit );
	};

	return (
		<div className="gutenx-spacing-section">
			<div className="gutenx-spacing-header">
				<span className="gutenx-spacing-title">{ label }</span>
				<ResponsiveDeviceSwitcher
					selectedDevice={ selectedDevice }
					onChange={ setDevice }
				/>
			</div>

			<div className="gutenx-spacing-row">
				{ SIDES.map( ( side ) => {
					const value = getCurrentValue( attributes, type, side, selectedDevice );
					const { num, unit } = parseValueAndUnit( value );
					return (
						<div className="gutenx-spacing-field" key={ side }>
							<div className="gutenx-spacing-input-wrap">
								<input
									type="number"
									value={ num }
									onChange={ ( e ) => onValueChange( side, e.target.value ) }
									className="gutenx-spacing-input"
								/>
								<UnitDropdown
									currentUnit={ unit }
									onChange={ ( u ) => onUnitChange( side, u ) }
								/>
							</div>
							<span className="gutenx-spacing-label">{ side }</span>
						</div>
					);
				} ) }
				<button
					className={ `gutenx-link-btn${ linked ? ' is-linked' : '' }` }
					onClick={ onToggleLink }
					title={ linked
						? __( 'Unlink sides', 'gutenx-blocks' )
						: __( 'Link sides', 'gutenx-blocks' ) }
					type="button"
				>
					{ linked ? <LinkIcon /> : <UnlinkIcon /> }
				</button>
			</div>
		</div>
	);
};

/* ─── SpacingPanel ─── */

const SpacingPanel = ( {
	attributes,
	setAttributes,
	label = __( 'Spacing', 'gutenx-blocks' ),
} ) => {
	const { selectedDevice, setDevice } = useDeviceType();

	const marginLinked = attributes.marginLink !== undefined ? attributes.marginLink : true;
	const paddingLinked = attributes.paddingLink !== undefined ? attributes.paddingLink : true;

	return (
		<PanelBody title={ label } initialOpen={ false }>
			<SpacingSection
				type="margin"
				label={ __( 'Margin', 'gutenx-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				selectedDevice={ selectedDevice }
				setDevice={ setDevice }
				linked={ marginLinked }
				onToggleLink={ () => setAttributes( { marginLink: ! marginLinked } ) }
			/>
			<SpacingSection
				type="padding"
				label={ __( 'Padding', 'gutenx-blocks' ) }
				attributes={ attributes }
				setAttributes={ setAttributes }
				selectedDevice={ selectedDevice }
				setDevice={ setDevice }
				linked={ paddingLinked }
				onToggleLink={ () => setAttributes( { paddingLink: ! paddingLinked } ) }
			/>
		</PanelBody>
	);
};

/* ─── Style helpers (unchanged API surface) ─── */

const getDesktopValue = ( attributes, type, side ) => {
	const key = getAttrName( type, side, 'desktop' );
	return attributes[ key ] || DEFAULTS[ `${ type }${ side }` ];
};

const getDeviceValue = ( attributes, type, side, device ) => {
	if ( device === 'desktop' ) {
		return getDesktopValue( attributes, type, side );
	}
	if ( device === 'tablet' ) {
		const key = getAttrName( type, side, 'tablet' );
		return attributes[ key ] || getDesktopValue( attributes, type, side );
	}
	// mobile → tablet → desktop
	const tKey = getAttrName( type, side, 'tablet' );
	const mKey = getAttrName( type, side, 'mobile' );
	return attributes[ mKey ] || attributes[ tKey ] || getDesktopValue( attributes, type, side );
};

/**
 * Get inline spacing style object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export const getSpacingStyle = ( attributes ) => {
	const activeDevice = attributes.spacingDevice || 'desktop';
	return {
		marginTop: getDeviceValue( attributes, 'margin', 'Top', activeDevice ),
		marginRight: getDeviceValue( attributes, 'margin', 'Right', activeDevice ),
		marginBottom: getDeviceValue( attributes, 'margin', 'Bottom', activeDevice ),
		marginLeft: getDeviceValue( attributes, 'margin', 'Left', activeDevice ),
		paddingTop: getDeviceValue( attributes, 'padding', 'Top', activeDevice ),
		paddingRight: getDeviceValue( attributes, 'padding', 'Right', activeDevice ),
		paddingBottom: getDeviceValue( attributes, 'padding', 'Bottom', activeDevice ),
		paddingLeft: getDeviceValue( attributes, 'padding', 'Left', activeDevice ),
	};
};

/**
 * Get CSS custom properties object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} CSS custom properties.
 */
export const getSpacingCSS = ( attributes ) => ( {
	'--gx-mt-desktop': getDesktopValue( attributes, 'margin', 'Top' ),
	'--gx-mr-desktop': getDesktopValue( attributes, 'margin', 'Right' ),
	'--gx-mb-desktop': getDesktopValue( attributes, 'margin', 'Bottom' ),
	'--gx-ml-desktop': getDesktopValue( attributes, 'margin', 'Left' ),
	'--gx-pt-desktop': getDesktopValue( attributes, 'padding', 'Top' ),
	'--gx-pr-desktop': getDesktopValue( attributes, 'padding', 'Right' ),
	'--gx-pb-desktop': getDesktopValue( attributes, 'padding', 'Bottom' ),
	'--gx-pl-desktop': getDesktopValue( attributes, 'padding', 'Left' ),
	'--gx-mt-tablet': getDeviceValue( attributes, 'margin', 'Top', 'tablet' ),
	'--gx-mr-tablet': getDeviceValue( attributes, 'margin', 'Right', 'tablet' ),
	'--gx-mb-tablet': getDeviceValue( attributes, 'margin', 'Bottom', 'tablet' ),
	'--gx-ml-tablet': getDeviceValue( attributes, 'margin', 'Left', 'tablet' ),
	'--gx-pt-tablet': getDeviceValue( attributes, 'padding', 'Top', 'tablet' ),
	'--gx-pr-tablet': getDeviceValue( attributes, 'padding', 'Right', 'tablet' ),
	'--gx-pb-tablet': getDeviceValue( attributes, 'padding', 'Bottom', 'tablet' ),
	'--gx-pl-tablet': getDeviceValue( attributes, 'padding', 'Left', 'tablet' ),
	'--gx-mt-mobile': getDeviceValue( attributes, 'margin', 'Top', 'mobile' ),
	'--gx-mr-mobile': getDeviceValue( attributes, 'margin', 'Right', 'mobile' ),
	'--gx-mb-mobile': getDeviceValue( attributes, 'margin', 'Bottom', 'mobile' ),
	'--gx-ml-mobile': getDeviceValue( attributes, 'margin', 'Left', 'mobile' ),
	'--gx-pt-mobile': getDeviceValue( attributes, 'padding', 'Top', 'mobile' ),
	'--gx-pr-mobile': getDeviceValue( attributes, 'padding', 'Right', 'mobile' ),
	'--gx-pb-mobile': getDeviceValue( attributes, 'padding', 'Bottom', 'mobile' ),
	'--gx-pl-mobile': getDeviceValue( attributes, 'padding', 'Left', 'mobile' ),
} );

export default SpacingPanel;

