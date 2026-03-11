/**
 * SpacingPanel — Margin & Padding Controls
 *
 * Reusable inspector control for margin and padding.
 * Outputs CSS custom properties and inline style objects.
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';

/**
 * Default spacing values.
 */
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

/**
 * SpacingPanel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes setAttribute function.
 * @param {string}   props.label         Panel label.
 * @return {JSX.Element} Spacing panel UI.
 */
const SpacingPanel = ( { attributes, setAttributes, label = __( 'Spacing', 'gutenx-blocks' ) } ) => {
	const {
		marginTop = DEFAULTS.marginTop,
		marginRight = DEFAULTS.marginRight,
		marginBottom = DEFAULTS.marginBottom,
		marginLeft = DEFAULTS.marginLeft,
		paddingTop = DEFAULTS.paddingTop,
		paddingRight = DEFAULTS.paddingRight,
		paddingBottom = DEFAULTS.paddingBottom,
		paddingLeft = DEFAULTS.paddingLeft,
	} = attributes;

	const updateMargin = ( side, value ) => {
		setAttributes( { [ `margin${ side }` ]: value } );
	};

	const updatePadding = ( side, value ) => {
		setAttributes( { [ `padding${ side }` ]: value } );
	};

	const parseValue = ( val ) => parseInt( val, 10 ) || 0;

	return (
		<PanelBody title={ label } initialOpen={ false }>
			<p className="gutenx-control-label">
				<strong>{ __( 'Margin', 'gutenx-blocks' ) }</strong>
			</p>
			<div className="gutenx-spacing-grid">
				<RangeControl
					label={ __( 'Top', 'gutenx-blocks' ) }
					value={ parseValue( marginTop ) }
					onChange={ ( val ) => updateMargin( 'Top', `${ val }px` ) }
					min={ -100 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Right', 'gutenx-blocks' ) }
					value={ parseValue( marginRight ) }
					onChange={ ( val ) => updateMargin( 'Right', `${ val }px` ) }
					min={ -100 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Bottom', 'gutenx-blocks' ) }
					value={ parseValue( marginBottom ) }
					onChange={ ( val ) => updateMargin( 'Bottom', `${ val }px` ) }
					min={ -100 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Left', 'gutenx-blocks' ) }
					value={ parseValue( marginLeft ) }
					onChange={ ( val ) => updateMargin( 'Left', `${ val }px` ) }
					min={ -100 }
					max={ 200 }
				/>
			</div>

			<p className="gutenx-control-label">
				<strong>{ __( 'Padding', 'gutenx-blocks' ) }</strong>
			</p>
			<div className="gutenx-spacing-grid">
				<RangeControl
					label={ __( 'Top', 'gutenx-blocks' ) }
					value={ parseValue( paddingTop ) }
					onChange={ ( val ) => updatePadding( 'Top', `${ val }px` ) }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Right', 'gutenx-blocks' ) }
					value={ parseValue( paddingRight ) }
					onChange={ ( val ) => updatePadding( 'Right', `${ val }px` ) }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Bottom', 'gutenx-blocks' ) }
					value={ parseValue( paddingBottom ) }
					onChange={ ( val ) => updatePadding( 'Bottom', `${ val }px` ) }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Left', 'gutenx-blocks' ) }
					value={ parseValue( paddingLeft ) }
					onChange={ ( val ) => updatePadding( 'Left', `${ val }px` ) }
					min={ 0 }
					max={ 200 }
				/>
			</div>
		</PanelBody>
	);
};

/**
 * Get inline spacing style object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export const getSpacingStyle = ( attributes ) => ( {
	marginTop: attributes.marginTop || DEFAULTS.marginTop,
	marginRight: attributes.marginRight || DEFAULTS.marginRight,
	marginBottom: attributes.marginBottom || DEFAULTS.marginBottom,
	marginLeft: attributes.marginLeft || DEFAULTS.marginLeft,
	paddingTop: attributes.paddingTop || DEFAULTS.paddingTop,
	paddingRight: attributes.paddingRight || DEFAULTS.paddingRight,
	paddingBottom: attributes.paddingBottom || DEFAULTS.paddingBottom,
	paddingLeft: attributes.paddingLeft || DEFAULTS.paddingLeft,
} );

/**
 * Get CSS custom properties object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} CSS custom properties.
 */
export const getSpacingCSS = ( attributes ) => ( {
	'--gx-mt': attributes.marginTop || DEFAULTS.marginTop,
	'--gx-mr': attributes.marginRight || DEFAULTS.marginRight,
	'--gx-mb': attributes.marginBottom || DEFAULTS.marginBottom,
	'--gx-ml': attributes.marginLeft || DEFAULTS.marginLeft,
	'--gx-pt': attributes.paddingTop || DEFAULTS.paddingTop,
	'--gx-pr': attributes.paddingRight || DEFAULTS.paddingRight,
	'--gx-pb': attributes.paddingBottom || DEFAULTS.paddingBottom,
	'--gx-pl': attributes.paddingLeft || DEFAULTS.paddingLeft,
} );

export default SpacingPanel;
