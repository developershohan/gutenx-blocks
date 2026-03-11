/**
 * BlockCard Component
 *
 * Individual block toggle card with icon, name, description, and toggle switch.
 *
 * @package GutenX_Blocks
 */

import { FormToggle } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * BlockCard — renders a single block toggle card.
 *
 * @param {Object}   props             Component props.
 * @param {string}   props.slug        Block slug.
 * @param {string}   props.label       Block display name.
 * @param {string}   props.description Block description.
 * @param {string}   props.icon        Block icon (emoji).
 * @param {boolean}  props.isEnabled   Whether the block is enabled.
 * @param {Function} props.onToggle    Toggle callback.
 * @param {boolean}  props.disabled    Disabled state during save.
 * @return {JSX.Element} Block card UI.
 */
const BlockCard = ( { slug, label, description, icon, isEnabled, onToggle, disabled } ) => {
	return (
		<div
			className={ `gutenx-card ${ isEnabled ? 'gutenx-card--active' : 'gutenx-card--inactive' }` }
			id={ `gutenx-card-${ slug }` }
		>
			<div className="gutenx-card__header">
				<div className="gutenx-card__icon">
					<span role="img" aria-label={ label }>
						{ icon }
					</span>
				</div>
				<div className="gutenx-card__info">
					<h3 className="gutenx-card__name">{ label }</h3>
					<p className="gutenx-card__desc">{ description }</p>
				</div>
			</div>

			<div className="gutenx-card__footer">
				<span
					className={ `gutenx-card__badge ${
						isEnabled ? 'gutenx-card__badge--active' : 'gutenx-card__badge--inactive'
					}` }
				>
					{ isEnabled
						? __( 'Active', 'gutenx-blocks' )
						: __( 'Inactive', 'gutenx-blocks' ) }
				</span>
				<FormToggle
					checked={ isEnabled }
					onChange={ onToggle }
					disabled={ disabled }
					aria-label={ `${ __( 'Toggle', 'gutenx-blocks' ) } ${ label }` }
				/>
			</div>
		</div>
	);
};

export default BlockCard;
