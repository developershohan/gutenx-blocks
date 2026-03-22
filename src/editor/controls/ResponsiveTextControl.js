/**
 * ResponsiveTextControl — Text/Number Input + Unit + Responsive
 *
 * Self-managing control. Pass attrName and it handles device-specific
 * attribute resolution, unit selection, and fallback chains.
 *
 * Usage:
 *   <ResponsiveTextControl
 *       label="Gap"
 *       attrName="gap"
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *       defaultValue="16px"
 *       units={ ['px', 'em', '%'] }
 *   />
 *
 * @package GutenX_Blocks
 */

import { useState, useRef } from '@wordpress/element';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ResponsiveDeviceSwitcher, { useDeviceType } from './ResponsiveDeviceSwitcher';
import { getResponsiveKey, getResponsiveValue, parseValueUnit, combineValueUnit } from './responsive-helpers';

const ResponsiveTextControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	defaultValue = '',
	units = null,
	type = 'text',
	placeholder = '',
	responsive = true,
} ) => {
	const { selectedDevice, setDevice } = useDeviceType();
	const device = responsive ? selectedDevice : 'desktop';

	// Resolve current value
	const rawValue = getResponsiveValue( attributes, attrName, device, defaultValue );
	const hasUnits = units && units.length > 0;
	const { num, unit: currentUnit } = hasUnits
		? parseValueUnit( rawValue, units[ 0 ] )
		: { num: rawValue, unit: '' };

	// Write handler
	const attrKey = getResponsiveKey( attrName, device );
	const handleChange = ( newNum ) => {
		const value = hasUnits ? combineValueUnit( newNum, currentUnit ) : newNum;
		setAttributes( { [ attrKey ]: value } );
	};

	const handleUnitChange = ( newUnit ) => {
		const value = combineValueUnit( num === '' ? 0 : num, newUnit );
		setAttributes( { [ attrKey ]: value } );
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
			<div className="gutenx-responsive-control__body">
				<div className={ `gutenx-responsive-control__input-wrap${ hasUnits ? ' has-unit' : '' }` }>
					<input
						type={ type }
						value={ num }
						onChange={ ( e ) => handleChange( e.target.value ) }
						placeholder={ placeholder }
						className="gutenx-responsive-control__input"
					/>
					{ hasUnits && (
						<UnitSelector
							units={ units }
							currentUnit={ currentUnit }
							onChange={ handleUnitChange }
						/>
					) }
				</div>
				{ responsive && device !== 'desktop' && (
					<span className="gutenx-responsive-control__hint">
						{ __( 'Inherits from desktop if empty', 'gutenx-blocks' ) }
					</span>
				) }
			</div>
		</div>
	);
};

/* ─── UnitSelector (shared) ─── */

export const UnitSelector = ( { units, currentUnit, onChange } ) => {
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
						{ units.map( ( u ) => (
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

export default ResponsiveTextControl;
