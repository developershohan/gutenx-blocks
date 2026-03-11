/**
 * Advanced Heading Block — Edit Component
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPicker } from '@wordpress/components';
import {
	InspectorTabs,
	TypographyPanel,
	SpacingPanel,
	getTypographyStyle,
	getSpacingStyle,
	getTypographyCSS,
	getSpacingCSS,
} from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const { content, level, textColor } = attributes;

	const TagName = `h${ level }`;

	const blockProps = useBlockProps( {
		style: {
			...getTypographyStyle( attributes ),
			...getSpacingStyle( attributes ),
			color: textColor,
			...getTypographyCSS( attributes ),
			...getSpacingCSS( attributes ),
		},
	} );

	const headingOptions = [
		{ label: 'H1', value: 1 },
		{ label: 'H2', value: 2 },
		{ label: 'H3', value: 3 },
		{ label: 'H4', value: 4 },
		{ label: 'H5', value: 5 },
		{ label: 'H6', value: 6 },
	];

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Heading Settings', 'gutenx-blocks' ) }>
						<SelectControl
							label={ __( 'Heading Level', 'gutenx-blocks' ) }
							value={ level }
							options={ headingOptions }
							onChange={ ( val ) => setAttributes( { level: parseInt( val, 10 ) } ) }
						/>
						<p>{ __( 'Text Color', 'gutenx-blocks' ) }</p>
						<ColorPicker
							color={ textColor }
							onChange={ ( val ) => setAttributes( { textColor: val } ) }
						/>
					</PanelBody>
				}
				styleTab={
					<>
						<TypographyPanel attributes={ attributes } setAttributes={ setAttributes } />
						<SpacingPanel attributes={ attributes } setAttributes={ setAttributes } />
					</>
				}
				advancedTab={
					<PanelBody title={ __( 'Advanced', 'gutenx-blocks' ) }>
						<p>{ /* PRO_HOOK: Custom CSS */ }
							{ __( 'Additional options available in Pro.', 'gutenx-blocks' ) }
						</p>
					</PanelBody>
				}
			/>

			<RichText
				{ ...blockProps }
				tagName={ TagName }
				value={ content }
				onChange={ ( val ) => setAttributes( { content: val } ) }
				placeholder={ __( 'Write heading…', 'gutenx-blocks' ) }
			/>
		</>
	);
};

export default Edit;
