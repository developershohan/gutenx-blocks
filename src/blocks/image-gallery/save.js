import { useBlockProps } from '@wordpress/block-editor';
import { getSpacingStyle, getBorderStyle } from '../../editor/controls';

const Save = ( { attributes } ) => {
	const { images, layout, columns, gap, aspectRatio, imageFit, enableLightbox, caption } = attributes;
	const blockProps = useBlockProps.save( {
		className: `gutenx-gallery gutenx-gallery--${ layout }`,
		style: { ...getSpacingStyle( attributes ), display: 'grid', gridTemplateColumns: `repeat(${ columns }, 1fr)`, gap },
		'data-lightbox': enableLightbox ? 'true' : 'false',
	} );

	return (
		<div { ...blockProps }>
			{ images.map( ( img, i ) => (
				<figure key={ img.id || i } className="gutenx-gallery__item" style={ { ...getBorderStyle( attributes ), margin: 0, overflow: 'hidden' } }>
					<a href={ enableLightbox ? img.url : undefined } className={ enableLightbox ? 'gutenx-lightbox-trigger' : undefined } data-full={ img.url }>
						<img src={ img.url } alt={ img.alt } loading="lazy" style={ { width: '100%', aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined, objectFit: imageFit, display: 'block', transition: 'transform 0.3s ease' } } />
					</a>
					{ caption && img.caption && <figcaption className="gutenx-gallery__caption">{ img.caption }</figcaption> }
				</figure>
			) ) }
		</div>
	);
};
export default Save;
