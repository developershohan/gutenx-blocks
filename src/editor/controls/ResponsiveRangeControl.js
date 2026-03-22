/**
 * ResponsiveRangeControl — Slider + Number Input + Unit + Responsive
 *
 * Combined slider and number input. Self-managing control.
 *
 * Usage:
 *   <ResponsiveRangeControl
 *       label="Width"
 *       attrName="maxWidth"
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *       defaultValue="1200"
 *       min={ 0 }
 *       max={ 2000 }
 *       step={ 1 }
 *       units={ ['px', '%', 'vw'] }
 *   />
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import ResponsiveDeviceSwitcher, { useDeviceType } from './ResponsiveDeviceSwitcher';
import { UnitSelector } from './ResponsiveTextControl';
import { getResponsiveKey, getResponsiveValue, parseValueUnit, combineValueUnit } from './responsive-helpers';

const ResponsiveRangeControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	defaultValue = '0',
	min = 0,
	max = 100,
	step = 1,
	units = null,
	responsive = true,
} ) => {
	const { selectedDevice, setDevice } = useDeviceType();
	const device = responsive ? selectedDevice : 'desktop';

	// Resolve current value
	const rawValue = getResponsiveValue( attributes, attrName, device, defaultValue );
	const hasUnits = units && units.length > 0;
	const { num, unit: currentUnit } = hasUnits
		? parseValueUnit( rawValue, units[ 0 ] )
		: { num: parseFloat( rawValue ) || 0, unit: '' };

	const numericVal = num === '' ? 0 : Number( num );

	// Write handler
	const attrKey = getResponsiveKey( attrName, device );
	const handleChange = ( newNum ) => {
		const value = hasUnits ? combineValueUnit( newNum, currentUnit ) : String( newNum );
		setAttributes( { [ attrKey ]: value } );
	};

	const handleUnitChange = ( newUnit ) => {
		const value = combineValueUnit( numericVal, newUnit );
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
			<div className="gutenx-range-control__body">
				<input
					type="range"
					className="gutenx-range-control__slider"
					value={ numericVal }
					onChange={ ( e ) => handleChange( Number( e.target.value ) ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				<div className={ `gutenx-range-control__input-wrap${ hasUnits ? ' has-unit' : '' }` }>
					<input
						type="number"
						className="gutenx-range-control__input"
						value={ numericVal }
						onChange={ ( e ) => handleChange( e.target.value === '' ? '' : Number( e.target.value ) ) }
						min={ min }
						max={ max }
						step={ step }
					/>
					{ hasUnits && (
						<UnitSelector
							units={ units }
							currentUnit={ currentUnit }
							onChange={ handleUnitChange }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default ResponsiveRangeControl;
