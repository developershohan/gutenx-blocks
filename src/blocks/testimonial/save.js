import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getSpacingStyle, getBackgroundStyle, getBorderStyle } from '../../editor/controls';

const Save = ( { attributes } ) => {
	const { quote, authorName, authorTitle, avatar, rating, layout, quoteColor } = attributes;
	const stars = Array.from( { length: 5 }, ( _, i ) => ( i < rating ? '★' : '☆' ) ).join( '' );
	const blockProps = useBlockProps.save( { className: `gutenx-testimonial gutenx-testimonial--${ layout }`, style: { ...getSpacingStyle( attributes ), ...getBackgroundStyle( attributes ), ...getBorderStyle( attributes ) } } );

	return (
		<blockquote { ...blockProps }>
			<div className="gutenx-testimonial__rating" style={ { color: '#F59E0B' } }>{ stars }</div>
			<RichText.Content tagName="p" className="gutenx-testimonial__quote" value={ quote } style={ { color: quoteColor } } />
			<div className="gutenx-testimonial__author">
				{ avatar?.url && <img src={ avatar.url } alt={ avatar.alt } className="gutenx-testimonial__avatar" /> }
				<div>
					<RichText.Content tagName="strong" className="gutenx-testimonial__name" value={ authorName } />
					<RichText.Content tagName="span" className="gutenx-testimonial__title" value={ authorTitle } />
				</div>
			</div>
		</blockquote>
	);
};
export default Save;
