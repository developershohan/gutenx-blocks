/**
 * TemplateLibrary — Modal Template Browser
 *
 * Full-screen modal displaying available templates with category filter.
 *
 * @package GutenX_Blocks
 */

import { useState } from '@wordpress/element';
import { Modal, Button, ButtonGroup, SearchControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import templateData from './templateData';
import TemplateCard from './TemplateCard';
import useTemplateInsert from './useTemplateInsert';

/**
 * Category filter list derived from template data.
 */
const CATEGORIES = [
	{ label: __( 'All', 'gutenx-blocks' ), value: 'all' },
	{ label: __( 'Landing', 'gutenx-blocks' ), value: 'landing' },
	{ label: __( 'Content', 'gutenx-blocks' ), value: 'content' },
	{ label: __( 'Social Proof', 'gutenx-blocks' ), value: 'social-proof' },
	{ label: __( 'Conversion', 'gutenx-blocks' ), value: 'conversion' },
];

/**
 * TemplateLibrary component.
 *
 * @param {Object}   props         Component props.
 * @param {boolean}  props.isOpen  Whether the modal is open.
 * @param {Function} props.onClose Callback to close the modal.
 * @return {JSX.Element|null} Template library modal or null.
 */
const TemplateLibrary = ( { isOpen, onClose } ) => {
	const [ activeCategory, setActiveCategory ] = useState( 'all' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const { insertTemplate, isInserting } = useTemplateInsert();

	if ( ! isOpen ) {
		return null;
	}

	const handleInsert = ( template ) => {
		insertTemplate( template );
		onClose();
	};

	// Filter templates by category and search.
	const filteredTemplates = templateData.filter( ( template ) => {
		const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
		const matchesSearch = searchQuery === '' ||
			template.name.toLowerCase().includes( searchQuery.toLowerCase() ) ||
			template.description.toLowerCase().includes( searchQuery.toLowerCase() );

		return matchesCategory && matchesSearch;
	} );

	return (
		<Modal
			title={ __( 'GutenX Template Library', 'gutenx-blocks' ) }
			onRequestClose={ onClose }
			className="gutenx-template-modal"
			isFullScreen
		>
			<div className="gutenx-template-modal__header">
				<div className="gutenx-template-modal__filters">
					<ButtonGroup>
						{ CATEGORIES.map( ( cat ) => (
							<Button
								key={ cat.value }
								variant={ activeCategory === cat.value ? 'primary' : 'secondary' }
								onClick={ () => setActiveCategory( cat.value ) }
								size="small"
							>
								{ cat.label }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
				<div className="gutenx-template-modal__search">
					<SearchControl
						value={ searchQuery }
						onChange={ setSearchQuery }
						placeholder={ __( 'Search templates…', 'gutenx-blocks' ) }
					/>
				</div>
			</div>

			<div className="gutenx-template-modal__grid">
				{ filteredTemplates.length === 0 ? (
					<div className="gutenx-template-modal__empty">
						<p>{ __( 'No templates found.', 'gutenx-blocks' ) }</p>
					</div>
				) : (
					filteredTemplates.map( ( template ) => (
						<TemplateCard
							key={ template.id }
							template={ template }
							onInsert={ handleInsert }
							isInserting={ isInserting }
						/>
					) )
				) }
			</div>

			<div className="gutenx-template-modal__footer">
				<span className="gutenx-template-modal__count">
					{ `${ filteredTemplates.length } ${ __( 'templates', 'gutenx-blocks' ) }` }
				</span>
				{ /* PRO_HOOK: "Get 50+ Pro Templates" upsell button */ }
			</div>
		</Modal>
	);
};

export default TemplateLibrary;
