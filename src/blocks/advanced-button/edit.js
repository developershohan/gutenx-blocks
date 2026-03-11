/**
 * Advanced Button Block — Edit Component
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ButtonGroup, Button, ToggleControl, ColorPicker } from '@wordpress/components';
import {
	InspectorTabs,
	TypographyPanel,
	SpacingPanel,
	BackgroundPanel,
	BorderPanel,
	getTypographyStyle,
	getSpacingStyle,
	getBackgroundStyle,
	getBorderStyle,
} from '../../editor/controls';

const SIZES = { small: { padding: '8px 16px', fontSize: '13px' }, medium: { padding: '12px 24px', fontSize: '15px' }, large: { padding: '16px 32px', fontSize: '17px' } };

const Edit = ( { attributes, setAttributes } ) => {
	const { text, url, linkTarget, buttonSize, hoverBg, hoverTextColor, textColor } = attributes;
	const sizeStyle = SIZES[ buttonSize ] || SIZES.medium;

	const blockProps = useBlockProps( {
		style: {
			...getBackgroundStyle( attributes ),
			...getTypographyStyle( attributes ),
			...getSpacingStyle( attributes ),
			...getBorderStyle( attributes ),
			...sizeStyle,
			color: textColor || '#ffffff',
			display: 'inline-block',
			textDecoration: 'none',
			cursor: 'pointer',
		},
	} );

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Button Settings', 'gutenx-blocks' ) }>
						<TextControl
							label={ __( 'URL', 'gutenx-blocks' ) }
							value={ url }
							onChange={ ( val ) => setAttributes( { url: val } ) }
							placeholder="https://"
						/>
						<ToggleControl
							label={ __( 'Open in New Tab', 'gutenx-blocks' ) }
							checked={ linkTarget === '_blank' }
							onChange={ ( val ) => setAttributes( { linkTarget: val ? '_blank' : '_self' } ) }
						/>
						<p>{ __( 'Button Size', 'gutenx-blocks' ) }</p>
						<ButtonGroup>
							{ [ 'small', 'medium', 'large' ].map( ( size ) => (
								<Button
									key={ size }
									variant={ buttonSize === size ? 'primary' : 'secondary' }
									onClick={ () => setAttributes( { buttonSize: size } ) }
									size="small"
								>
									{ size.charAt( 0 ).toUpperCase() + size.slice( 1 ) }
								</Button>
							) ) }
						</ButtonGroup>
					</PanelBody>
				}
				styleTab={
					<>
						<BackgroundPanel attributes={ attributes } setAttributes={ setAttributes } />
						<TypographyPanel attributes={ attributes } setAttributes={ setAttributes } />
						<SpacingPanel attributes={ attributes } setAttributes={ setAttributes } />
						<BorderPanel attributes={ attributes } setAttributes={ setAttributes } />
						<PanelBody title={ __( 'Text Color', 'gutenx-blocks' ) } initialOpen={ false }>
							<ColorPicker
								color={ textColor || '#ffffff' }
								onChange={ ( val ) => setAttributes( { textColor: val } ) }
							/>
						</PanelBody>
					</>
				}
				advancedTab={
					<PanelBody title={ __( 'Hover Effects', 'gutenx-blocks' ) }>
						<p>{ __( 'Hover Background', 'gutenx-blocks' ) }</p>
						<ColorPicker
							color={ hoverBg || '#4A2A8A' }
							onChange={ ( val ) => setAttributes( { hoverBg: val } ) }
						/>
						<p>{ __( 'Hover Text Color', 'gutenx-blocks' ) }</p>
						<ColorPicker
							color={ hoverTextColor || '#ffffff' }
							onChange={ ( val ) => setAttributes( { hoverTextColor: val } ) }
						/>
						{ /* PRO_HOOK: hover animation presets */ }
					</PanelBody>
				}
			/>
			<RichText
				{ ...blockProps }
				tagName="a"
				value={ text }
				onChange={ ( val ) => setAttributes( { text: val } ) }
				placeholder={ __( 'Button text…', 'gutenx-blocks' ) }
				allowedFormats={ [] }
			/>
		</>
	);
};

export default Edit;
