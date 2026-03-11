import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, ToggleControl, Button, ButtonGroup } from '@wordpress/components';
import { InspectorTabs, SpacingPanel, BorderPanel, getSpacingStyle, getBorderStyle } from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const { images, layout, columns, gap, aspectRatio, imageFit, enableLightbox, caption } = attributes;
	const blockProps = useBlockProps( {
		className: `gutenx-gallery gutenx-gallery--${ layout }`,
		style: { ...getSpacingStyle( attributes ), display: 'grid', gridTemplateColumns: `repeat(${ columns }, 1fr)`, gap },
	} );

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Gallery Settings', 'gutenx-blocks' ) }>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( { images: media.map( ( m ) => ( { url: m.url, id: m.id, alt: m.alt || '', caption: m.caption || '' } ) ) } ) }
								allowedTypes={ [ 'image' ] }
								multiple
								gallery
								value={ images.map( ( img ) => img.id ) }
								render={ ( { open } ) => (
									<Button variant="secondary" onClick={ open } style={ { width: '100%', justifyContent: 'center' } }>
										{ images.length > 0 ? __( 'Edit Gallery', 'gutenx-blocks' ) : __( 'Select Images', 'gutenx-blocks' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						<p style={ { marginTop: 8, color: '#6B7280', fontSize: 12 } }>{ `${ images.length } ${ __( 'images selected', 'gutenx-blocks' ) }` }</p>
						<p>{ __( 'Layout', 'gutenx-blocks' ) }</p>
						<ButtonGroup>
							<Button variant={ layout === 'grid' ? 'primary' : 'secondary' } onClick={ () => setAttributes( { layout: 'grid' } ) } size="small">{ __( 'Grid', 'gutenx-blocks' ) }</Button>
							<Button variant={ layout === 'masonry' ? 'primary' : 'secondary' } onClick={ () => setAttributes( { layout: 'masonry' } ) } size="small">{ __( 'Masonry', 'gutenx-blocks' ) }</Button>
						</ButtonGroup>
						<RangeControl label={ __( 'Columns', 'gutenx-blocks' ) } value={ columns } onChange={ ( val ) => setAttributes( { columns: val } ) } min={ 1 } max={ 6 } />
						<SelectControl label={ __( 'Aspect Ratio', 'gutenx-blocks' ) } value={ aspectRatio } options={ [
							{ label: '1:1', value: '1/1' }, { label: '4:3', value: '4/3' }, { label: '16:9', value: '16/9' }, { label: 'Auto', value: 'auto' },
						] } onChange={ ( val ) => setAttributes( { aspectRatio: val } ) } />
						<SelectControl label={ __( 'Image Fit', 'gutenx-blocks' ) } value={ imageFit } options={ [
							{ label: 'Cover', value: 'cover' }, { label: 'Contain', value: 'contain' },
						] } onChange={ ( val ) => setAttributes( { imageFit: val } ) } />
						<ToggleControl label={ __( 'Enable Lightbox', 'gutenx-blocks' ) } checked={ enableLightbox } onChange={ ( val ) => setAttributes( { enableLightbox: val } ) } />
						<ToggleControl label={ __( 'Show Captions', 'gutenx-blocks' ) } checked={ caption } onChange={ ( val ) => setAttributes( { caption: val } ) } />
						{ /* PRO_HOOK: lazy loading + filter tabs by category */ }
					</PanelBody>
				}
				styleTab={ <><SpacingPanel attributes={ attributes } setAttributes={ setAttributes } /><BorderPanel attributes={ attributes } setAttributes={ setAttributes } /></> }
				advancedTab={ <PanelBody title={ __( 'Advanced', 'gutenx-blocks' ) }><p>{ __( 'Pro options coming soon.', 'gutenx-blocks' ) }</p></PanelBody> }
			/>
			<div { ...blockProps }>
				{ images.length === 0 ? (
					<div style={ { gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#9CA3AF' } }>
						<p>{ __( 'No images selected. Use the sidebar to add images.', 'gutenx-blocks' ) }</p>
					</div>
				) : images.map( ( img, i ) => (
					<figure key={ img.id || i } className="gutenx-gallery__item" style={ { ...getBorderStyle( attributes ), margin: 0, overflow: 'hidden' } }>
						<img src={ img.url } alt={ img.alt } style={ { width: '100%', aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined, objectFit: imageFit, display: 'block' } } />
						{ caption && img.caption && <figcaption className="gutenx-gallery__caption">{ img.caption }</figcaption> }
					</figure>
				) ) }
			</div>
		</>
	);
};
export default Edit;
