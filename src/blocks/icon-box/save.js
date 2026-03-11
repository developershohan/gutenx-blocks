import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTypographyStyle, getSpacingStyle } from '../../editor/controls';
const ICONS = { star: '⭐', heart: '❤️', bolt: '⚡', shield: '🛡️', globe: '🌍', rocket: '🚀', check: '✅', light: '💡', target: '🎯', code: '💻', chart: '📊', users: '👥', lock: '🔒', bell: '🔔', gear: '⚙️', mail: '📧', phone: '📱', camera: '📷', gift: '🎁', trophy: '🏆' };

const Save = ( { attributes } ) => {
	const { icon, iconSize, iconColor, iconBackground, iconShape, title, description, layout } = attributes;
	const blockProps = useBlockProps.save( { className: `gutenx-icon-box gutenx-icon-box--layout-${ layout }`, style: getSpacingStyle( attributes ) } );
	return (
		<div { ...blockProps }>
			<div className={ `gutenx-icon-box__icon gutenx-icon-box__icon--${ iconShape }` } style={ { fontSize: iconSize, color: iconColor, backgroundColor: iconShape !== 'none' ? iconBackground : 'transparent', borderRadius: iconShape === 'circle' ? '50%' : iconShape === 'square' ? '8px' : '0' } }>
				<span role="img" aria-hidden="true">{ ICONS[ icon ] || '⭐' }</span>
			</div>
			<div className="gutenx-icon-box__content">
				<RichText.Content tagName="h3" className="gutenx-icon-box__title" value={ title } style={ getTypographyStyle( attributes ) } />
				<RichText.Content tagName="p" className="gutenx-icon-box__desc" value={ description } />
			</div>
		</div>
	);
};
export default Save;
