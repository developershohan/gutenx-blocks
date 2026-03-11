/**
 * Advanced Heading Block — Save Component
 *
 * @package GutenX_Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTypographyStyle, getSpacingStyle, getTypographyCSS, getSpacingCSS } from '../../editor/controls';

const Save = ( { attributes } ) => {
	const { content, level, textColor } = attributes;
	const TagName = `h${ level }`;

	const blockProps = useBlockProps.save( {
		style: {
			...getTypographyStyle( attributes ),
			...getSpacingStyle( attributes ),
			color: textColor,
			...getTypographyCSS( attributes ),
			...getSpacingCSS( attributes ),
		},
	} );

	return (
		<RichText.Content
			{ ...blockProps }
			tagName={ TagName }
			value={ content }
		/>
	);
};

export default Save;
