/**
 * BorderPanel — Border Width, Style, Color & Radius Controls
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ColorPicker,
	ToggleControl,
} from '@wordpress/components';

/**
 * BorderPanel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes setAttribute function.
 * @return {JSX.Element} Border panel UI.
 */
const BorderPanel = ( { attributes, setAttributes } ) => {
	const {
		borderWidth = '0px',
		borderStyle = 'none',
		borderColor = '#E5E7EB',
		borderRadius = '8px',
		borderTopLeft = '8px',
		borderTopRight = '8px',
		borderBottomLeft = '8px',
		borderBottomRight = '8px',
		borderLinkCorners = true,
	} = attributes;

	const parseVal = ( val ) => parseInt( val, 10 ) || 0;

	const updateRadius = ( corner, value ) => {
		if ( borderLinkCorners ) {
			setAttributes( {
				borderRadius: `${ value }px`,
				borderTopLeft: `${ value }px`,
				borderTopRight: `${ value }px`,
				borderBottomLeft: `${ value }px`,
				borderBottomRight: `${ value }px`,
			} );
		} else {
			setAttributes( { [ corner ]: `${ value }px` } );
		}
	};

	return (
		<PanelBody title={ __( 'Border & Radius', 'gutenx-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Border Width', 'gutenx-blocks' ) }
				value={ parseVal( borderWidth ) }
				onChange={ ( val ) => setAttributes( { borderWidth: `${ val }px` } ) }
				min={ 0 }
				max={ 20 }
			/>

			<SelectControl
				label={ __( 'Border Style', 'gutenx-blocks' ) }
				value={ borderStyle }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Solid', value: 'solid' },
					{ label: 'Dashed', value: 'dashed' },
					{ label: 'Dotted', value: 'dotted' },
				] }
				onChange={ ( val ) => setAttributes( { borderStyle: val } ) }
			/>

			<div className="gutenx-border-color">
				<p>{ __( 'Border Color', 'gutenx-blocks' ) }</p>
				<ColorPicker
					color={ borderColor }
					onChange={ ( val ) => setAttributes( { borderColor: val } ) }
				/>
			</div>

			<ToggleControl
				label={ __( 'Link Corners', 'gutenx-blocks' ) }
				checked={ borderLinkCorners }
				onChange={ ( val ) => setAttributes( { borderLinkCorners: val } ) }
			/>

			{ borderLinkCorners ? (
				<RangeControl
					label={ __( 'Border Radius', 'gutenx-blocks' ) }
					value={ parseVal( borderRadius ) }
					onChange={ ( val ) => updateRadius( 'borderRadius', val ) }
					min={ 0 }
					max={ 100 }
				/>
			) : (
				<>
					<RangeControl
						label={ __( 'Top Left', 'gutenx-blocks' ) }
						value={ parseVal( borderTopLeft ) }
						onChange={ ( val ) => updateRadius( 'borderTopLeft', val ) }
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Top Right', 'gutenx-blocks' ) }
						value={ parseVal( borderTopRight ) }
						onChange={ ( val ) => updateRadius( 'borderTopRight', val ) }
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Bottom Left', 'gutenx-blocks' ) }
						value={ parseVal( borderBottomLeft ) }
						onChange={ ( val ) => updateRadius( 'borderBottomLeft', val ) }
						min={ 0 }
						max={ 100 }
					/>
					<RangeControl
						label={ __( 'Bottom Right', 'gutenx-blocks' ) }
						value={ parseVal( borderBottomRight ) }
						onChange={ ( val ) => updateRadius( 'borderBottomRight', val ) }
						min={ 0 }
						max={ 100 }
					/>
				</>
			) }
		</PanelBody>
	);
};

/**
 * Get border inline style.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export const getBorderStyle = ( attributes ) => {
	const style = {};
	const { borderLinkCorners = true } = attributes;

	if ( attributes.borderWidth && attributes.borderStyle !== 'none' ) {
		style.borderWidth = attributes.borderWidth || '0px';
		style.borderStyle = attributes.borderStyle || 'solid';
		style.borderColor = attributes.borderColor || '#E5E7EB';
	}

	if ( borderLinkCorners ) {
		style.borderRadius = attributes.borderRadius || '8px';
	} else {
		style.borderTopLeftRadius = attributes.borderTopLeft || '8px';
		style.borderTopRightRadius = attributes.borderTopRight || '8px';
		style.borderBottomLeftRadius = attributes.borderBottomLeft || '8px';
		style.borderBottomRightRadius = attributes.borderBottomRight || '8px';
	}

	return style;
};

/**
 * Get border CSS custom properties.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} CSS custom properties.
 */
export const getBorderCSS = ( attributes ) => ( {
	'--gx-border-width': attributes.borderWidth || '0px',
	'--gx-border-style': attributes.borderStyle || 'none',
	'--gx-border-color': attributes.borderColor || '#E5E7EB',
	'--gx-border-radius': attributes.borderRadius || '8px',
	'--gx-border-tl': attributes.borderTopLeft || '8px',
	'--gx-border-tr': attributes.borderTopRight || '8px',
	'--gx-border-bl': attributes.borderBottomLeft || '8px',
	'--gx-border-br': attributes.borderBottomRight || '8px',
} );

export default BorderPanel;
