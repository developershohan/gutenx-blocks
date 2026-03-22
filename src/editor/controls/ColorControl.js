/**
 * ColorControl — Color Picker with Label + Swatch
 *
 * Self-managing color picker. Shows a clickable swatch that expands
 * to a full color picker popover.
 *
 * Usage:
 *   <ColorControl
 *       label="Background Color"
 *       attrName="backgroundColor"
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *       defaultValue="#ffffff"
 *   />
 *
 * @package GutenX_Blocks
 */

import { useState, useRef } from '@wordpress/element';
import { ColorPicker, Popover } from '@wordpress/components';

const ColorControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	defaultValue = '#ffffff',
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const swatchRef = useRef();

	const currentColor = attributes[ attrName ] || defaultValue;

	return (
		<div className="gutenx-color-control">
			<div className="gutenx-color-control__header">
				<span className="gutenx-responsive-control__label">{ label }</span>
				<button
					ref={ swatchRef }
					className="gutenx-color-control__swatch"
					style={ { backgroundColor: currentColor } }
					onClick={ () => setIsOpen( ! isOpen ) }
					type="button"
					aria-label={ label }
				/>
			</div>
			{ isOpen && (
				<Popover
					anchor={ swatchRef.current }
					position="bottom left"
					onClose={ () => setIsOpen( false ) }
					className="gutenx-color-control__popover"
					focusOnMount="container"
				>
					<ColorPicker
						color={ currentColor }
						onChange={ ( val ) => setAttributes( { [ attrName ]: val } ) }
					/>
				</Popover>
			) }
		</div>
	);
};

export default ColorControl;
