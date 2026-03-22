/**
 * ResponsiveDimensionsControl — 4 Inputs + Unit + Link + Responsive
 *
 * Self-managing 4-sided input (e.g. margin, padding, border-radius).
 * Supports configurable side names (Top/Right/Bottom/Left or TL/TR/BR/BL).
 *
 * Usage:
 *   <ResponsiveDimensionsControl
 *       label="Border Radius"
 *       attrName="borderRadius"
 *       sides={ ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'] }
 *       sideLabels={ ['TL', 'TR', 'BR', 'BL'] }
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *       defaultValue="0"
 *       units={ ['px', '%', 'em'] }
 *   />
 *   // Manages: borderRadiusTopLeft, borderRadiusTopLeftTablet, etc.
 *   // Also manages: borderRadiusLink (boolean)
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import ResponsiveDeviceSwitcher, { useDeviceType } from './ResponsiveDeviceSwitcher';
import { UnitSelector } from './ResponsiveTextControl';
import { getResponsiveKey, getResponsiveValue, parseValueUnit, combineValueUnit } from './responsive-helpers';

/* ─── Icons ─── */

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

/* ─── Default Configuration ─── */

const DEFAULT_SIDES = [ 'Top', 'Right', 'Bottom', 'Left' ];
const DEFAULT_LABELS = [ 'Top', 'Right', 'Bottom', 'Left' ];

/* ─── Component ─── */

const ResponsiveDimensionsControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	sides = DEFAULT_SIDES,
	sideLabels = DEFAULT_LABELS,
	defaultValue = '0',
	units = [ 'px', '%', 'em' ],
	responsive = true,
} ) => {
	const { selectedDevice, setDevice } = useDeviceType();
	const device = responsive ? selectedDevice : 'desktop';

	// Link attribute: e.g. "borderRadiusLink"
	const linkAttrName = `${ attrName }Link`;
	const linked = attributes[ linkAttrName ] !== undefined ? attributes[ linkAttrName ] : true;

	// Get value for a specific side
	const getSideValue = ( side ) => {
		const sideAttrName = `${ attrName }${ side }`;
		return getResponsiveValue( attributes, sideAttrName, device, defaultValue );
	};

	// Update value for a side (uses that side's current unit)
	const updateSide = ( side, newNum ) => {
		const sideVal = getSideValue( side );
		const { unit: sideUnit } = parseValueUnit( sideVal, units[ 0 ] );
		const formatted = combineValueUnit( newNum === '' ? '' : newNum, sideUnit );
		const affectedSides = linked ? sides : [ side ];
		const updates = {};

		affectedSides.forEach( ( s ) => {
			const sideAttrName = `${ attrName }${ s }`;
			const key = getResponsiveKey( sideAttrName, device );
			updates[ key ] = formatted;
		} );

		setAttributes( updates );
	};

	// Unit change for a specific side (or all if linked)
	const handleSideUnitChange = ( side, newUnit ) => {
		const affectedSides = linked ? sides : [ side ];
		const updates = {};

		affectedSides.forEach( ( s ) => {
			const sideAttrName = `${ attrName }${ s }`;
			const rawVal = getSideValue( s );
			const { num } = parseValueUnit( rawVal, units[ 0 ] );
			const key = getResponsiveKey( sideAttrName, device );
			updates[ key ] = combineValueUnit( num === '' ? 0 : num, newUnit );
		} );

		setAttributes( updates );
	};

	return (
		<div className="gutenx-responsive-control">
			<div className="gutenx-responsive-control__header">
				<span className="gutenx-responsive-control__label">{ label }</span>
				{ responsive && (
					<ResponsiveDeviceSwitcher
						selectedDevice={ selectedDevice }
						onChange={ setDevice }
					/>
				) }
			</div>
			<div className="gutenx-dimensions-control__body">
				{ sides.map( ( side, i ) => {
					const rawVal = getSideValue( side );
					const { num, unit: sideUnit } = parseValueUnit( rawVal, units[ 0 ] );
					return (
						<div className="gutenx-dimensions-control__field" key={ side }>
							<div className="gutenx-dimensions-control__input-wrap has-unit">
								<input
									type="number"
									value={ num }
									onChange={ ( e ) => updateSide( side, e.target.value ) }
									className="gutenx-dimensions-control__input"
								/>
								<UnitSelector
									units={ units }
									currentUnit={ sideUnit }
									onChange={ ( u ) => handleSideUnitChange( side, u ) }
								/>
							</div>
							<span className="gutenx-dimensions-control__side-label">
								{ sideLabels[ i ] || side }
							</span>
						</div>
					);
				} ) }
				{ /* Link / unlink button */ }
				<button
					className={ `gutenx-link-btn${ linked ? ' is-linked' : '' }` }
					onClick={ () => setAttributes( { [ linkAttrName ]: ! linked } ) }
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

export default ResponsiveDimensionsControl;
