import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import { InspectorTabs, SpacingPanel, BackgroundPanel, getSpacingStyle } from '../../editor/controls';

const Edit = ( { attributes, setAttributes } ) => {
	const { columns, columnGap, rowGap, verticalAlign, stackOnMobile } = attributes;
	const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end', stretch: 'stretch' };

	const blockProps = useBlockProps( {
		className: `gutenx-row gutenx-row--cols-${ columns }${ stackOnMobile ? ' gutenx-row--stack-mobile' : '' }`,
		style: { ...getSpacingStyle( attributes ), display: 'grid', gridTemplateColumns: `repeat(${ columns }, 1fr)`, columnGap, rowGap, alignItems: alignMap[ verticalAlign ] || 'stretch' },
	} );

	const template = Array( columns ).fill( [ 'core/paragraph', { placeholder: __( 'Column content…', 'gutenx-blocks' ) } ] );

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Row Settings', 'gutenx-blocks' ) }>
						<RangeControl label={ __( 'Columns', 'gutenx-blocks' ) } value={ columns } onChange={ ( val ) => setAttributes( { columns: val } ) } min={ 1 } max={ 6 } />
						<TextControl label={ __( 'Column Gap', 'gutenx-blocks' ) } value={ columnGap } onChange={ ( val ) => setAttributes( { columnGap: val } ) } />
						<TextControl label={ __( 'Row Gap', 'gutenx-blocks' ) } value={ rowGap } onChange={ ( val ) => setAttributes( { rowGap: val } ) } />
						<SelectControl label={ __( 'Vertical Align', 'gutenx-blocks' ) } value={ verticalAlign } options={ [
							{ label: 'Top', value: 'top' }, { label: 'Center', value: 'center' }, { label: 'Bottom', value: 'bottom' }, { label: 'Stretch', value: 'stretch' },
						] } onChange={ ( val ) => setAttributes( { verticalAlign: val } ) } />
						<ToggleControl label={ __( 'Stack on Mobile', 'gutenx-blocks' ) } checked={ stackOnMobile } onChange={ ( val ) => setAttributes( { stackOnMobile: val } ) } />
					</PanelBody>
				}
				styleTab={ <BackgroundPanel attributes={ attributes } setAttributes={ setAttributes } /> }
				advancedTab={ <SpacingPanel attributes={ attributes } setAttributes={ setAttributes } /> }
			/>
			<div { ...blockProps }><InnerBlocks template={ template } templateLock="insert" /></div>
		</>
	);
};
export default Edit;
