import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSpacingStyle } from '../../editor/controls';

const Save = ( { attributes } ) => {
	const { columns, columnGap, rowGap, verticalAlign, stackOnMobile } = attributes;
	const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end', stretch: 'stretch' };
	const blockProps = useBlockProps.save( {
		className: `gutenx-row gutenx-row--cols-${ columns }${ stackOnMobile ? ' gutenx-row--stack-mobile' : '' }`,
		style: { ...getSpacingStyle( attributes ), display: 'grid', gridTemplateColumns: `repeat(${ columns }, 1fr)`, columnGap, rowGap, alignItems: alignMap[ verticalAlign ] || 'stretch' },
	} );
	return <div { ...blockProps }><InnerBlocks.Content /></div>;
};
export default Save;
