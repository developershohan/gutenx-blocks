/**
 * BackgroundPanel — Background Color, Gradient & Image Controls
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ColorPicker,
	RangeControl,
	SelectControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * BackgroundPanel component.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes setAttribute function.
 * @param {boolean}  props.enableImage   Enable image background option.
 * @return {JSX.Element} Background panel UI.
 */
const BackgroundPanel = ( { attributes, setAttributes, enableImage = false } ) => {
	const {
		backgroundColor = '#ffffff',
		backgroundGradient = 'linear-gradient(135deg, #6C3FC5, #4A2A8A)',
		backgroundType = 'color',
		backgroundImage = { url: '', id: 0, alt: '' },
		backgroundSize = 'cover',
		backgroundPosition = 'center center',
		overlayColor = '#000000',
		overlayOpacity = 0,
	} = attributes;

	const bgTypes = [
		{ label: __( 'Color', 'gutenx-blocks' ), value: 'color' },
		{ label: __( 'Gradient', 'gutenx-blocks' ), value: 'gradient' },
	];

	if ( enableImage ) {
		bgTypes.push( { label: __( 'Image', 'gutenx-blocks' ), value: 'image' } );
	}

	return (
		<PanelBody title={ __( 'Background', 'gutenx-blocks' ) } initialOpen={ false }>
			<div className="gutenx-bg-type-selector">
				<ButtonGroup>
					{ bgTypes.map( ( type ) => (
						<Button
							key={ type.value }
							variant={ backgroundType === type.value ? 'primary' : 'secondary' }
							onClick={ () => setAttributes( { backgroundType: type.value } ) }
							size="small"
						>
							{ type.label }
						</Button>
					) ) }
				</ButtonGroup>
			</div>

			{ backgroundType === 'color' && (
				<div className="gutenx-color-control">
					<p>{ __( 'Background Color', 'gutenx-blocks' ) }</p>
					<ColorPicker
						color={ backgroundColor }
						onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
						enableAlpha
					/>
				</div>
			) }

			{ backgroundType === 'gradient' && (
				<div className="gutenx-gradient-control">
					<p>{ __( 'Gradient', 'gutenx-blocks' ) }</p>
					<SelectControl
						value={ backgroundGradient }
						options={ [
							{ label: 'Purple', value: 'linear-gradient(135deg, #6C3FC5, #4A2A8A)' },
							{ label: 'Sunset', value: 'linear-gradient(135deg, #FF6B35, #F7C948)' },
							{ label: 'Ocean', value: 'linear-gradient(135deg, #0EA5E9, #6366F1)' },
							{ label: 'Forest', value: 'linear-gradient(135deg, #22C55E, #14B8A6)' },
							{ label: 'Dark', value: 'linear-gradient(135deg, #1A1A2E, #16213E)' },
						] }
						onChange={ ( val ) => setAttributes( { backgroundGradient: val } ) }
					/>
				</div>
			) }

			{ backgroundType === 'image' && enableImage && (
				<div className="gutenx-image-control">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									backgroundImage: {
										url: media.url,
										id: media.id,
										alt: media.alt || '',
									},
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ backgroundImage?.id }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open }>
									{ backgroundImage?.url
										? __( 'Change Image', 'gutenx-blocks' )
										: __( 'Select Image', 'gutenx-blocks' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					{ backgroundImage?.url && (
						<>
							<img
								src={ backgroundImage.url }
								alt={ backgroundImage.alt }
								style={ { width: '100%', marginTop: '8px', borderRadius: '4px' } }
							/>
							<SelectControl
								label={ __( 'Size', 'gutenx-blocks' ) }
								value={ backgroundSize }
								options={ [
									{ label: 'Cover', value: 'cover' },
									{ label: 'Contain', value: 'contain' },
									{ label: 'Auto', value: 'auto' },
								] }
								onChange={ ( val ) => setAttributes( { backgroundSize: val } ) }
							/>
							<SelectControl
								label={ __( 'Position', 'gutenx-blocks' ) }
								value={ backgroundPosition }
								options={ [
									{ label: 'Center', value: 'center center' },
									{ label: 'Top', value: 'center top' },
									{ label: 'Bottom', value: 'center bottom' },
									{ label: 'Left', value: 'left center' },
									{ label: 'Right', value: 'right center' },
								] }
								onChange={ ( val ) => setAttributes( { backgroundPosition: val } ) }
							/>
							<Button
								variant="link"
								isDestructive
								onClick={ () => setAttributes( { backgroundImage: { url: '', id: 0, alt: '' } } ) }
							>
								{ __( 'Remove Image', 'gutenx-blocks' ) }
							</Button>
						</>
					) }
				</div>
			) }

			{ /* Overlay Controls */ }
			<div className="gutenx-overlay-control" style={ { marginTop: '16px' } }>
				<p><strong>{ __( 'Overlay', 'gutenx-blocks' ) }</strong></p>
				<ColorPicker
					color={ overlayColor }
					onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Overlay Opacity', 'gutenx-blocks' ) }
					value={ overlayOpacity }
					onChange={ ( val ) => setAttributes( { overlayOpacity: val } ) }
					min={ 0 }
					max={ 1 }
					step={ 0.05 }
				/>
			</div>
		</PanelBody>
	);
};

/**
 * Get background inline style.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Inline style object.
 */
export const getBackgroundStyle = ( attributes ) => {
	const { backgroundType = 'color' } = attributes;
	const style = {};

	if ( backgroundType === 'color' ) {
		style.backgroundColor = attributes.backgroundColor || '#ffffff';
	} else if ( backgroundType === 'gradient' ) {
		style.background = attributes.backgroundGradient || 'linear-gradient(135deg, #6C3FC5, #4A2A8A)';
	} else if ( backgroundType === 'image' && attributes.backgroundImage?.url ) {
		style.backgroundImage = `url(${ attributes.backgroundImage.url })`;
		style.backgroundSize = attributes.backgroundSize || 'cover';
		style.backgroundPosition = attributes.backgroundPosition || 'center center';
		style.backgroundRepeat = 'no-repeat';
	}

	return style;
};

/**
 * Get background CSS custom properties.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} CSS custom properties.
 */
export const getBackgroundCSS = ( attributes ) => {
	const { backgroundType = 'color' } = attributes;

	return {
		'--gx-bg-type': backgroundType,
		'--gx-bg-color': attributes.backgroundColor || '#ffffff',
		'--gx-bg-gradient': attributes.backgroundGradient || '',
		'--gx-bg-image': attributes.backgroundImage?.url ? `url(${ attributes.backgroundImage.url })` : 'none',
		'--gx-bg-size': attributes.backgroundSize || 'cover',
		'--gx-bg-position': attributes.backgroundPosition || 'center center',
		'--gx-overlay-color': attributes.overlayColor || '#000000',
		'--gx-overlay-opacity': String( attributes.overlayOpacity ?? 0 ),
	};
};

export default BackgroundPanel;
