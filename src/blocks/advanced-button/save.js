/**
 * Advanced Button Block — Save Component
 *
 * @package GutenX_Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTypographyStyle, getSpacingStyle, getBackgroundStyle, getBorderStyle } from '../../editor/controls';

const SIZES = { small: { padding: '8px 16px', fontSize: '13px' }, medium: { padding: '12px 24px', fontSize: '15px' }, large: { padding: '16px 32px', fontSize: '17px' } };

const Save = ( { attributes } ) => {
	const { text, url, linkTarget, buttonSize, hoverBg, hoverTextColor, textColor } = attributes;
	const sizeStyle = SIZES[ buttonSize ] || SIZES.medium;

	const blockProps = useBlockProps.save( {
		style: {
			...getBackgroundStyle( attributes ),
			...getTypographyStyle( attributes ),
			...getSpacingStyle( attributes ),
			...getBorderStyle( attributes ),
			...sizeStyle,
			color: textColor || '#ffffff',
			display: 'inline-block',
			textDecoration: 'none',
			transition: 'background 0.3s ease, color 0.3s ease, transform 0.2s ease',
		},
	} );

	return (
		<RichText.Content
			{ ...blockProps }
			tagName="a"
			value={ text }
			href={ url || '#' }
			target={ linkTarget }
			rel={ linkTarget === '_blank' ? 'noopener noreferrer' : undefined }
			data-hover-bg={ hoverBg || '' }
			data-hover-color={ hoverTextColor || '' }
		/>
	);
};

export default Save;
