import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Button, ColorPicker } from '@wordpress/components';
import { InspectorTabs, SpacingPanel, BackgroundPanel, BorderPanel, getSpacingStyle, getBackgroundStyle, getBorderStyle } from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const { quote, authorName, authorTitle, avatar, rating, layout, quoteColor } = attributes;
	const stars = Array.from( { length: 5 }, ( _, i ) => ( i < rating ? '★' : '☆' ) ).join( '' );
	const blockProps = useBlockProps( { className: `gutenx-testimonial gutenx-testimonial--${ layout }`, style: { ...getSpacingStyle( attributes ), ...getBackgroundStyle( attributes ), ...getBorderStyle( attributes ) } } );

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Testimonial Settings', 'gutenx-blocks' ) }>
						<MediaUploadCheck>
							<MediaUpload onSelect={ ( media ) => setAttributes( { avatar: { url: media.url, id: media.id, alt: media.alt || '' } } ) } allowedTypes={ [ 'image' ] } value={ avatar?.id } render={ ( { open } ) => (
								<>
									{ avatar?.url && <img src={ avatar.url } alt={ avatar.alt } style={ { width: 60, height: 60, borderRadius: '50%', marginBottom: 8, objectFit: 'cover' } } /> }
									<Button variant="secondary" onClick={ open }>{ avatar?.url ? __( 'Change Avatar', 'gutenx-blocks' ) : __( 'Upload Avatar', 'gutenx-blocks' ) }</Button>
								</>
							) } />
						</MediaUploadCheck>
						<RangeControl label={ __( 'Rating', 'gutenx-blocks' ) } value={ rating } onChange={ ( val ) => setAttributes( { rating: val } ) } min={ 0 } max={ 5 } />
						<SelectControl label={ __( 'Layout', 'gutenx-blocks' ) } value={ layout } options={ [
							{ label: 'Card', value: 'card' }, { label: 'Minimal', value: 'minimal' }, { label: 'Centered', value: 'centered' },
						] } onChange={ ( val ) => setAttributes( { layout: val } ) } />
						<p>{ __( 'Quote Color', 'gutenx-blocks' ) }</p>
						<ColorPicker color={ quoteColor } onChange={ ( val ) => setAttributes( { quoteColor: val } ) } />
						{ /* PRO_HOOK: carousel mode (multiple testimonials) */ }
					</PanelBody>
				}
				styleTab={ <><BackgroundPanel attributes={ attributes } setAttributes={ setAttributes } /><SpacingPanel attributes={ attributes } setAttributes={ setAttributes } /><BorderPanel attributes={ attributes } setAttributes={ setAttributes } /></> }
				advancedTab={ <PanelBody title={ __( 'Advanced', 'gutenx-blocks' ) }><p>{ __( 'Pro options coming soon.', 'gutenx-blocks' ) }</p></PanelBody> }
			/>
			<blockquote { ...blockProps }>
				<div className="gutenx-testimonial__rating" style={ { color: '#F59E0B' } }>{ stars }</div>
				<RichText tagName="p" className="gutenx-testimonial__quote" value={ quote } onChange={ ( val ) => setAttributes( { quote: val } ) } placeholder={ __( 'Write testimonial…', 'gutenx-blocks' ) } style={ { color: quoteColor } } />
				<div className="gutenx-testimonial__author">
					{ avatar?.url && <img src={ avatar.url } alt={ avatar.alt } className="gutenx-testimonial__avatar" /> }
					<div>
						<RichText tagName="strong" className="gutenx-testimonial__name" value={ authorName } onChange={ ( val ) => setAttributes( { authorName: val } ) } placeholder={ __( 'Author Name', 'gutenx-blocks' ) } />
						<RichText tagName="span" className="gutenx-testimonial__title" value={ authorTitle } onChange={ ( val ) => setAttributes( { authorTitle: val } ) } placeholder={ __( 'Author Title', 'gutenx-blocks' ) } />
					</div>
				</div>
			</blockquote>
		</>
	);
};
export default Edit;
