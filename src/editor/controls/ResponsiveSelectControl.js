/**
 * ResponsiveSelectControl — Dropdown + Responsive
 *
 * Self-managing select dropdown with responsive device switcher.
 *
 * Usage:
 *   <ResponsiveSelectControl
 *       label="Text Align"
 *       attrName="textAlign"
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *       defaultValue="left"
 *       options={ [
 *           { label: 'Left', value: 'left' },
 *           { label: 'Center', value: 'center' },
 *       ] }
 *   />
 *
 * @package GutenX_Blocks
 */

import { SelectControl } from '@wordpress/components';
import ResponsiveDeviceSwitcher, { useDeviceType } from './ResponsiveDeviceSwitcher';
import { getResponsiveKey, getResponsiveValue } from './responsive-helpers';

const ResponsiveSelectControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	defaultValue = '',
	options = [],
	responsive = true,
} ) => {
	const { selectedDevice, setDevice } = useDeviceType();
	const device = responsive ? selectedDevice : 'desktop';

	const currentValue = getResponsiveValue( attributes, attrName, device, defaultValue );
	const attrKey = getResponsiveKey( attrName, device );

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
				<SelectControl
					value={ currentValue }
					options={ options }
					onChange={ ( val ) => setAttributes( { [ attrKey ]: val } ) }
					__nextHasNoMarginBottom
				/>
			</div>
		</div>
	);
};

export default ResponsiveSelectControl;
