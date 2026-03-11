/**
 * TypographyPanel — Font & Text Controls
 *
 * Reusable inspector control for typography settings.
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	FontSizePicker,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Font weight options.
 */
const FONT_WEIGHTS = [
	{ label: '100 — Thin', value: '100' },
	{ label: '200 — Extra Light', value: '200' },
	{ label: '300 — Light', value: '300' },
	{ label: '400 — Normal', value: '400' },
	{ label: '500 — Medium', value: '500' },
	{ label: '600 — Semi Bold', value: '600' },
	{ label: '700 — Bold', value: '700' },
	{ label: '800 — Extra Bold', value: '800' },
	{ label: '900 — Black', value: '900' },
];

/**
 * Font family options.
 */
const FONT_FAMILIES = [
	{ label: 'System UI', value: 'system-ui, sans-serif' },
	{ label: 'Inter', value: "'Inter', sans-serif" },
	{ label: 'Roboto', value: "'Roboto', sans-serif" },
	{ label: 'Georgia', value: 'Georgia, serif' },
	{ label: 'Monospace', value: "'SFMono-Regular', monospace" },
	{ label: 'Custom', value: 'custom' },
];

/**
 * Text transform options.
 */
const TEXT_TRANSFORMS = [
	{ label: 'None', value: 'none' },
	{ label: 'Uppercase', value: 'uppercase' },
	{ label: 'Lowercase', value: 'lowercase' },
	{ label: 'Capitalize', value: 'capitalize' },
];

/**
 * TypographyPanel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes setAttribute function.
 * @return {JSX.Element} Typography panel UI.
 */
const TypographyPanel = ( { attributes, setAttributes } ) => {
	const {
		fontSize = '18px',
		fontWeight = '400',
		lineHeight = '1.6',
		letterSpacing = '0px',
		fontFamily = 'system-ui, sans-serif',
		customFontFamily = '',
		textTransform = 'none',
		textAlign = 'left',
	} = attributes;

	const parseFontSize = () => parseInt( fontSize, 10 ) || 18;

	return (
		<PanelBody title={ __( 'Typography', 'gutenx-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Font Size (px)', 'gutenx-blocks' ) }
				value={ parseFontSize() }
				onChange={ ( val ) => setAttributes( { fontSize: `${ val }px` } ) }
				min={ 8 }
				max={ 120 }
			/>

			<SelectControl
				label={ __( 'Font Weight', 'gutenx-blocks' ) }
				value={ fontWeight }
				options={ FONT_WEIGHTS }
				onChange={ ( val ) => setAttributes( { fontWeight: val } ) }
			/>

			<RangeControl
				label={ __( 'Line Height', 'gutenx-blocks' ) }
				value={ parseFloat( lineHeight ) || 1.6 }
				onChange={ ( val ) => setAttributes( { lineHeight: String( val ) } ) }
				min={ 0.8 }
				max={ 3.0 }
				step={ 0.1 }
			/>

			<RangeControl
				label={ __( 'Letter Spacing (px)', 'gutenx-blocks' ) }
				value={ parseInt( letterSpacing, 10 ) || 0 }
				onChange={ ( val ) => setAttributes( { letterSpacing: `${ val }px` } ) }
				min={ -2 }
				max={ 10 }
				step={ 0.5 }
			/>

			<SelectControl
				label={ __( 'Font Family', 'gutenx-blocks' ) }
				value={ fontFamily === 'custom' || ! FONT_FAMILIES.find( f => f.value === fontFamily ) ? 'custom' : fontFamily }
				options={ FONT_FAMILIES }
				onChange={ ( val ) => setAttributes( { fontFamily: val } ) }
			/>

			{ ( fontFamily === 'custom' ) && (
				<TextControl
					label={ __( 'Custom Font Family', 'gutenx-blocks' ) }
					value={ customFontFamily }
					onChange={ ( val ) => setAttributes( { customFontFamily: val } ) }
					placeholder="'Your Font', sans-serif"
				/>
			) }

			<SelectControl
				label={ __( 'Text Transform', 'gutenx-blocks' ) }
				value={ textTransform }
				options={ TEXT_TRANSFORMS }
				onChange={ ( val ) => setAttributes( { textTransform: val } ) }
			/>

			<div className="gutenx-text-align-control">
				<p>{ __( 'Text Alignment', 'gutenx-blocks' ) }</p>
				<ToggleGroupControl
					value={ textAlign }
					onChange={ ( val ) => setAttributes( { textAlign: val } ) }
					isBlock
				>
					<ToggleGroupControlOption value="left" label="←" />
					<ToggleGroupControlOption value="center" label="↔" />
					<ToggleGroupControlOption value="right" label="→" />
					<ToggleGroupControlOption value="justify" label="⇔" />
				</ToggleGroupControl>
			</div>
		</PanelBody>
	);
};

/**
 * Get inline typography style object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export const getTypographyStyle = ( attributes ) => {
	const { fontFamily = 'system-ui, sans-serif', customFontFamily = '' } = attributes;
	const resolvedFont = fontFamily === 'custom' && customFontFamily ? customFontFamily : fontFamily;

	return {
		fontSize: attributes.fontSize || '18px',
		fontWeight: attributes.fontWeight || '400',
		lineHeight: attributes.lineHeight || '1.6',
		letterSpacing: attributes.letterSpacing || '0px',
		fontFamily: resolvedFont,
		textTransform: attributes.textTransform || 'none',
		textAlign: attributes.textAlign || 'left',
	};
};

/**
 * Get CSS custom properties object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} CSS custom properties.
 */
export const getTypographyCSS = ( attributes ) => {
	const { fontFamily = 'system-ui, sans-serif', customFontFamily = '' } = attributes;
	const resolvedFont = fontFamily === 'custom' && customFontFamily ? customFontFamily : fontFamily;

	return {
		'--gx-font-size': attributes.fontSize || '18px',
		'--gx-font-weight': attributes.fontWeight || '400',
		'--gx-line-height': attributes.lineHeight || '1.6',
		'--gx-letter-spacing': attributes.letterSpacing || '0px',
		'--gx-font-family': resolvedFont,
		'--gx-text-transform': attributes.textTransform || 'none',
		'--gx-text-align': attributes.textAlign || 'left',
	};
};

export default TypographyPanel;
