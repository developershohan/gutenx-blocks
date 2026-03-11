import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ColorPicker, ButtonGroup, Button } from '@wordpress/components';
import { InspectorTabs, TypographyPanel, SpacingPanel, getTypographyStyle, getSpacingStyle } from '../../editor/controls';

const ICONS = { star: '⭐', heart: '❤️', bolt: '⚡', shield: '🛡️', globe: '🌍', rocket: '🚀', check: '✅', light: '💡', target: '🎯', code: '💻', chart: '📊', users: '👥', lock: '🔒', bell: '🔔', gear: '⚙️', mail: '📧', phone: '📱', camera: '📷', gift: '🎁', trophy: '🏆' };

const Edit = ( { attributes, setAttributes } ) => {
	const { icon, iconSize, iconColor, iconBackground, iconShape, title, description, layout } = attributes;
	const IconEmoji = ICONS[ icon ] || '⭐';

	const blockProps = useBlockProps( {
		className: `gutenx-icon-box gutenx-icon-box--layout-${ layout }`,
		style: getSpacingStyle( attributes ),
	} );

	return (
		<>
			<InspectorTabs
				generalTab={
					<PanelBody title={ __( 'Icon Box Settings', 'gutenx-blocks' ) }>
						<p>{ __( 'Select Icon', 'gutenx-blocks' ) }</p>
						<div style={ { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '16px' } }>
							{ Object.entries( ICONS ).map( ( [ key, emoji ] ) => (
								<Button key={ key } variant={ icon === key ? 'primary' : 'secondary' } onClick={ () => setAttributes( { icon: key } ) } style={ { fontSize: '18px', padding: '8px', minWidth: 0 } }>{ emoji }</Button>
							) ) }
						</div>
						<RangeControl label={ __( 'Icon Size', 'gutenx-blocks' ) } value={ parseInt( iconSize, 10 ) || 48 } onChange={ ( val ) => setAttributes( { iconSize: `${ val }px` } ) } min={ 16 } max={ 120 } />
						<p>{ __( 'Icon Color', 'gutenx-blocks' ) }</p>
						<ColorPicker color={ iconColor } onChange={ ( val ) => setAttributes( { iconColor: val } ) } />
						<p>{ __( 'Icon Background', 'gutenx-blocks' ) }</p>
						<ColorPicker color={ iconBackground } onChange={ ( val ) => setAttributes( { iconBackground: val } ) } />
						<SelectControl label={ __( 'Icon Shape', 'gutenx-blocks' ) } value={ iconShape } options={ [
							{ label: 'Circle', value: 'circle' }, { label: 'Square', value: 'square' }, { label: 'None', value: 'none' },
						] } onChange={ ( val ) => setAttributes( { iconShape: val } ) } />
						<SelectControl label={ __( 'Layout', 'gutenx-blocks' ) } value={ layout } options={ [
							{ label: 'Top', value: 'top' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' },
						] } onChange={ ( val ) => setAttributes( { layout: val } ) } />
						{ /* PRO_HOOK: icon animation (bounce/spin/pulse on hover) */ }
					</PanelBody>
				}
				styleTab={ <><TypographyPanel attributes={ attributes } setAttributes={ setAttributes } /><SpacingPanel attributes={ attributes } setAttributes={ setAttributes } /></> }
				advancedTab={ <PanelBody title={ __( 'Advanced', 'gutenx-blocks' ) }><p>{ __( 'Pro options coming soon.', 'gutenx-blocks' ) }</p></PanelBody> }
			/>
			<div { ...blockProps }>
				<div className={ `gutenx-icon-box__icon gutenx-icon-box__icon--${ iconShape }` } style={ { fontSize: iconSize, color: iconColor, backgroundColor: iconShape !== 'none' ? iconBackground : 'transparent', borderRadius: iconShape === 'circle' ? '50%' : iconShape === 'square' ? '8px' : '0' } }>
					<span role="img" aria-hidden="true">{ IconEmoji }</span>
				</div>
				<div className="gutenx-icon-box__content">
					<RichText tagName="h3" className="gutenx-icon-box__title" value={ title } onChange={ ( val ) => setAttributes( { title: val } ) } placeholder={ __( 'Feature Title', 'gutenx-blocks' ) } style={ getTypographyStyle( attributes ) } />
					<RichText tagName="p" className="gutenx-icon-box__desc" value={ description } onChange={ ( val ) => setAttributes( { description: val } ) } placeholder={ __( 'Description text here.', 'gutenx-blocks' ) } />
				</div>
			</div>
		</>
	);
};
export default Edit;
