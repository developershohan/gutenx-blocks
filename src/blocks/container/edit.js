import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import {
	InspectorTabs,
	SpacingPanel,
	BackgroundPanel,
	BorderPanel,
	getSpacingStyle,
	getBackgroundStyle,
	getBorderStyle,
	// ─── Atomic Controls ───
	ResponsiveRangeControl,
	ResponsiveDimensionsControl,
	getResponsiveValue,
} from '../../editor/controls';
import { useDeviceType } from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const {
		tagName,
		displayType,
		flexDirection,
		flexWrap,
		justifyContent,
		alignItems,
		gap,
		gridColumns,
		isFullWidth,
		minHeight,
	} = attributes;

	// Device type — needed for responsive inline styles in editor preview
	const { selectedDevice } = useDeviceType();

	// Resolve responsive maxWidth for the editor preview
	const currentMaxWidth = getResponsiveValue( attributes, 'maxWidth', selectedDevice, '1200px' );

	// Resolve responsive border-radius for the editor preview
	const brTL = getResponsiveValue( attributes, 'borderRadiusTopLeft', selectedDevice, '0px' );
	const brTR = getResponsiveValue( attributes, 'borderRadiusTopRight', selectedDevice, '0px' );
	const brBR = getResponsiveValue( attributes, 'borderRadiusBottomRight', selectedDevice, '0px' );
	const brBL = getResponsiveValue( attributes, 'borderRadiusBottomLeft', selectedDevice, '0px' );

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
			maxWidth: isFullWidth ? '100%' : currentMaxWidth,
			minHeight: minHeight || undefined,
			margin: isFullWidth ? '0' : undefined,
			// Override border-radius with responsive values
			borderTopLeftRadius: brTL,
			borderTopRightRadius: brTR,
			borderBottomRightRadius: brBR,
			borderBottomLeftRadius: brBL,
		},
	} );

	return (
		<>
			<InspectorTabs
				generalTab={
					<>
						<PanelBody title={ __( 'Layout', 'gutenx-blocks' ) }>
							<SelectControl
								label={ __( 'HTML Tag', 'gutenx-blocks' ) }
								value={ tagName }
								options={ [
									{ label: 'div', value: 'div' },
									{ label: 'section', value: 'section' },
									{ label: 'article', value: 'article' },
									{ label: 'main', value: 'main' },
									{ label: 'aside', value: 'aside' },
								] }
								onChange={ ( val ) => setAttributes( { tagName: val } ) }
							/>

							<ToggleGroupControl
								label={ __( 'Display', 'gutenx-blocks' ) }
								value={ displayType }
								onChange={ ( val ) => setAttributes( { displayType: val } ) }
								isBlock
							>
								<ToggleGroupControlOption value="flex" label="Flex" />
								<ToggleGroupControlOption value="grid" label="Grid" />
							</ToggleGroupControl>

							{ displayType === 'flex' && (
								<>
									<SelectControl
										label={ __( 'Direction', 'gutenx-blocks' ) }
										value={ flexDirection }
										options={ [
											{ label: 'Row', value: 'row' },
											{ label: 'Column', value: 'column' },
										] }
										onChange={ ( val ) =>
											setAttributes( { flexDirection: val } )
										}
									/>
									<SelectControl
										label={ __( 'Wrap', 'gutenx-blocks' ) }
										value={ flexWrap }
										options={ [
											{ label: 'No Wrap', value: 'nowrap' },
											{ label: 'Wrap', value: 'wrap' },
										] }
										onChange={ ( val ) => setAttributes( { flexWrap: val } ) }
									/>
									<SelectControl
										label={ __( 'Justify', 'gutenx-blocks' ) }
										value={ justifyContent }
										options={ [
											{ label: 'Start', value: 'flex-start' },
											{ label: 'Center', value: 'center' },
											{ label: 'End', value: 'flex-end' },
											{ label: 'Between', value: 'space-between' },
											{ label: 'Around', value: 'space-around' },
										] }
										onChange={ ( val ) =>
											setAttributes( { justifyContent: val } )
										}
									/>
									<SelectControl
										label={ __( 'Align', 'gutenx-blocks' ) }
										value={ alignItems }
										options={ [
											{ label: 'Stretch', value: 'stretch' },
											{ label: 'Start', value: 'flex-start' },
											{ label: 'Center', value: 'center' },
											{ label: 'End', value: 'flex-end' },
										] }
										onChange={ ( val ) => setAttributes( { alignItems: val } ) }
									/>
								</>
							) }

							{ displayType === 'grid' && (
								<RangeControl
									label={ __( 'Columns', 'gutenx-blocks' ) }
									value={ gridColumns }
									onChange={ ( val ) => setAttributes( { gridColumns: val } ) }
									min={ 1 }
									max={ 6 }
								/>
							) }

							{ /* ─── Width: ResponsiveRangeControl ───
							     Just 1 line! The control handles device switching,
							     attribute read/write, unit selector, and fallback chain.
							*/ }
							{ ! isFullWidth && (
								<ResponsiveRangeControl
									label={ __( 'Width', 'gutenx-blocks' ) }
									attrName="maxWidth"
									attributes={ attributes }
									setAttributes={ setAttributes }
									defaultValue="1200"
									min={ 0 }
									max={ 2000 }
									step={ 1 }
									units={ [ 'px', '%', 'vw' ] }
								/>
							) }

							<ToggleControl
								label={ __( 'Full Width', 'gutenx-blocks' ) }
								checked={ isFullWidth }
								onChange={ ( val ) => setAttributes( { isFullWidth: val } ) }
							/>
						</PanelBody>
					</>
				}
				styleTab={
					<>
						<BackgroundPanel
							attributes={ attributes }
							setAttributes={ setAttributes }
							enableImage
						/>
						<BorderPanel attributes={ attributes } setAttributes={ setAttributes } />

						{ /* ─── Border Radius: ResponsiveDimensionsControl ───
						     Just 1 line! 4 corner inputs + unit + link/unlink + responsive.
						*/ }
						<PanelBody title={ __( 'Border Radius', 'gutenx-blocks' ) } initialOpen={ false }>
							<ResponsiveDimensionsControl
								label={ __( 'Radius', 'gutenx-blocks' ) }
								attrName="borderRadius"
								sides={ [ 'TopLeft', 'TopRight', 'BottomRight', 'BottomLeft' ] }
								sideLabels={ [ 'TL', 'TR', 'BR', 'BL' ] }
								attributes={ attributes }
								setAttributes={ setAttributes }
								defaultValue="0"
								units={ [ 'px', '%', 'em' ] }
							/>
						</PanelBody>
					</>
				}
				advancedTab={
					<>
						<SpacingPanel attributes={ attributes } setAttributes={ setAttributes } />
						{ /* PRO_HOOK: sticky/parallax options */ }
					</>
				}
			/>
			<div { ...blockProps }>
				<InnerBlocks renderAppender={ InnerBlocks.ButtonBlockAppender } />
			</div>
		</>
	);
};
export default Edit;
