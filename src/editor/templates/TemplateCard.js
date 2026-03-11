/**
 * TemplateCard — Individual Template Preview Card
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * TemplateCard component.
 *
 * @param {Object}   props             Component props.
 * @param {Object}   props.template    Template data object.
 * @param {Function} props.onInsert    Insert callback.
 * @param {boolean}  props.isInserting  Currently inserting flag.
 * @return {JSX.Element} Template card UI.
 */
const TemplateCard = ( { template, onInsert, isInserting } ) => {
	return (
		<div className={ `gutenx-template-card ${ template.isPro ? 'gutenx-template-card--pro' : '' }` }>
			<div className="gutenx-template-card__preview">
				<span className="gutenx-template-card__icon" role="img" aria-hidden="true">
					{ template.icon }
				</span>
			</div>
			<div className="gutenx-template-card__info">
				<h3 className="gutenx-template-card__name">
					{ template.name }
					{ template.isPro && (
						<span className="gutenx-template-card__pro-badge">PRO</span>
					) }
				</h3>
				<p className="gutenx-template-card__desc">{ template.description }</p>
				<span className="gutenx-template-card__category">{ template.category }</span>
			</div>
			<div className="gutenx-template-card__actions">
				{ template.isPro ? (
					<Button variant="secondary" disabled className="gutenx-template-card__btn">
						{ __( 'Upgrade to Pro', 'gutenx-blocks' ) }
					</Button>
				) : (
					<Button
						variant="primary"
						onClick={ () => onInsert( template ) }
						isBusy={ isInserting }
						disabled={ isInserting }
						className="gutenx-template-card__btn"
					>
						{ isInserting
							? __( 'Inserting…', 'gutenx-blocks' )
							: __( 'Insert Template', 'gutenx-blocks' ) }
					</Button>
				) }
			</div>
		</div>
	);
};

export default TemplateCard;
