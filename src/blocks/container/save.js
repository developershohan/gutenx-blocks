import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSpacingStyle, getBackgroundStyle, getBorderStyle } from '../../editor/controls';

const Save = ( { attributes } ) => {
	const { tagName, displayType, flexDirection, flexWrap, justifyContent, alignItems, gap, gridColumns, maxWidth, isFullWidth, minHeight } = attributes;
	const TagName = tagName || 'div';
	const layoutStyle = {};
	if ( displayType === 'flex' ) { layoutStyle.display = 'flex'; layoutStyle.flexDirection = flexDirection; layoutStyle.flexWrap = flexWrap; layoutStyle.justifyContent = justifyContent; layoutStyle.alignItems = alignItems; layoutStyle.gap = gap; }
	else if ( displayType === 'grid' ) { layoutStyle.display = 'grid'; layoutStyle.gridTemplateColumns = `repeat(${ gridColumns }, 1fr)`; layoutStyle.gap = gap; }

	const blockProps = useBlockProps.save( { style: { ...getSpacingStyle( attributes ), ...getBackgroundStyle( attributes ), ...getBorderStyle( attributes ), ...layoutStyle, maxWidth: isFullWidth ? '100%' : maxWidth, minHeight: minHeight || undefined } } );
	return <TagName { ...blockProps }><InnerBlocks.Content /></TagName>;
};
export default Save;
