import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { InspectorTabs, SpacingPanel, BackgroundPanel, BorderPanel, getSpacingStyle, getBackgroundStyle, getBorderStyle } from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const { tagName, displayType, flexDirection, flexWrap, justifyContent, alignItems, gap, gridColumns, maxWidth, isFullWidth, minHeight } = attributes;

	const layoutStyle = {};
	if ( displayType === 'flex' ) {
		layoutStyle.display = 'flex';
		layoutStyle.flexDirection = flexDirection;
		layoutStyle.flexWrap = flexWrap;
		layoutStyle.justifyContent = justifyContent;
		layoutStyle.alignItems = alignItems;
		layoutStyle.gap = gap;
	} else if ( displayType === 'grid' ) {
		layoutStyle.display = 'grid';
		layoutStyle.gridTemplateColumns = `repeat(${ gridColumns }, 1fr)`;
		layoutStyle.gap = gap;
	}

	const blockProps = useBlockProps( {
		style: {
			...getSpacingStyle( attributes ),
			...getBackgroundStyle( attributes ),
			...getBorderStyle( attributes ),
			...layoutStyle,
			maxWidth: isFullWidth ? '100%' : maxWidth,
			minHeight: minHeight || undefined,
			margin: isFullWidth ? '0' : undefined,
		},
	} );

	return (
		<>
			<InspectorTabs
				generalTab={
					<>
						<PanelBody title={ __( 'Layout', 'gutenx-blocks' ) }>
							<SelectControl label={ __( 'HTML Tag', 'gutenx-blocks' ) } value={ tagName } options={ [
								{ label: 'div', value: 'div' }, { label: 'section', value: 'section' }, { label: 'article', value: 'article' }, { label: 'main', value: 'main' }, { label: 'aside', value: 'aside' },
							] } onChange={ ( val ) => setAttributes( { tagName: val } ) } />

							<ToggleGroupControl label={ __( 'Display', 'gutenx-blocks' ) } value={ displayType } onChange={ ( val ) => setAttributes( { displayType: val } ) } isBlock>
								<ToggleGroupControlOption value="block" label="Block" />
								<ToggleGroupControlOption value="flex" label="Flex" />
								<ToggleGroupControlOption value="grid" label="Grid" />
							</ToggleGroupControl>

							{ displayType === 'flex' && (
								<>
									<SelectControl label={ __( 'Direction', 'gutenx-blocks' ) } value={ flexDirection } options={ [
										{ label: 'Row', value: 'row' }, { label: 'Column', value: 'column' },
									] } onChange={ ( val ) => setAttributes( { flexDirection: val } ) } />
									<SelectControl label={ __( 'Wrap', 'gutenx-blocks' ) } value={ flexWrap } options={ [
										{ label: 'No Wrap', value: 'nowrap' }, { label: 'Wrap', value: 'wrap' },
									] } onChange={ ( val ) => setAttributes( { flexWrap: val } ) } />
									<SelectControl label={ __( 'Justify', 'gutenx-blocks' ) } value={ justifyContent } options={ [
										{ label: 'Start', value: 'flex-start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'flex-end' }, { label: 'Between', value: 'space-between' }, { label: 'Around', value: 'space-around' },
									] } onChange={ ( val ) => setAttributes( { justifyContent: val } ) } />
									<SelectControl label={ __( 'Align', 'gutenx-blocks' ) } value={ alignItems } options={ [
										{ label: 'Stretch', value: 'stretch' }, { label: 'Start', value: 'flex-start' }, { label: 'Center', value: 'center' }, { label: 'End', value: 'flex-end' },
									] } onChange={ ( val ) => setAttributes( { alignItems: val } ) } />
								</>
							) }

							{ displayType === 'grid' && (
								<RangeControl label={ __( 'Columns', 'gutenx-blocks' ) } value={ gridColumns } onChange={ ( val ) => setAttributes( { gridColumns: val } ) } min={ 1 } max={ 6 } />
							) }

							<TextControl label={ __( 'Gap', 'gutenx-blocks' ) } value={ gap } onChange={ ( val ) => setAttributes( { gap: val } ) } />
							<TextControl label={ __( 'Max Width', 'gutenx-blocks' ) } value={ maxWidth } onChange={ ( val ) => setAttributes( { maxWidth: val } ) } />
							<ToggleControl label={ __( 'Full Width', 'gutenx-blocks' ) } checked={ isFullWidth } onChange={ ( val ) => setAttributes( { isFullWidth: val } ) } />
							<TextControl label={ __( 'Min Height', 'gutenx-blocks' ) } value={ minHeight } onChange={ ( val ) => setAttributes( { minHeight: val } ) } />
						</PanelBody>
					</>
				}
				styleTab={ <><BackgroundPanel attributes={ attributes } setAttributes={ setAttributes } enableImage /><BorderPanel attributes={ attributes } setAttributes={ setAttributes } /></> }
				advancedTab={ <><SpacingPanel attributes={ attributes } setAttributes={ setAttributes } />{ /* PRO_HOOK: sticky/parallax options */ }</> }
			/>
			<div { ...blockProps }><InnerBlocks /></div>
		</>
	);
};
export default Edit;
