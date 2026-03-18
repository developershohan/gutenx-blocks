/**
 * TemplateLibrary — Modal Template Browser
 *
 * Full-screen modal displaying available templates with category filter.
 *
 * @package GutenX_Blocks
 */

import { useState, useEffect } from '@wordpress/element';
import { Modal, Button, ButtonGroup, SearchControl, Spinner } from '@wordpress/components';
import { Icon, layout, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import TemplateCard from './TemplateCard';
import useTemplateInsert from './useTemplateInsert';

/**
 * Helper to capitalize category labels.
 *
 * @param {string} slug Category slug.
 * @return {string} Capitalized label.
 */
const getCategoryLabel = ( slug ) => {
	if ( ! slug ) return '';
	return slug.charAt( 0 ).toUpperCase() + slug.slice( 1 ).replace( /-/g, ' ' );
};

/**
 * TemplateLibrary component.
 *
 * @param {Object}   props         Component props.
 * @param {boolean}  props.isOpen  Whether the modal is open.
 * @param {Function} props.onClose Callback to close the modal.
 * @return {JSX.Element|null} Template library modal or null.
 */
const TemplateLibrary = ( { isOpen, onClose } ) => {
	const [ activeTab, setActiveTab ] = useState( 'block' );
	const [ activeCategory, setActiveCategory ] = useState( 'all' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ templates, setTemplates ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const { insertTemplate, isInserting } = useTemplateInsert();

	useEffect( () => {
		if ( isOpen ) {
			setIsLoading( true );
			setError( null );
			fetch( 'http://api.local/wp-json/library/v1/export' )
				.then( ( response ) => {
					if ( ! response.ok ) {
						throw new Error( 'Failed to fetch templates' );
					}
					return response.json();
				} )
				.then( ( data ) => {
					setTemplates( data );
					setIsLoading( false );
				} )
				.catch( ( err ) => {
					setError( err.message );
					setIsLoading( false );
				} );
		}
	}, [ isOpen ] );

	// Reset category when switching tabs.
	useEffect( () => {
		setActiveCategory( 'all' );
	}, [ activeTab ] );

	if ( ! isOpen ) {
		return null;
	}

	const handleInsert = ( template ) => {
		insertTemplate( template );
		onClose();
	};

	// Get unique categories for the active tab.
	const dynamicCategories = [
		{ label: __( 'All', 'gutenx-blocks' ), value: 'all' },
		...Array.from( new Set(
			templates
				.filter( t => t.type === activeTab && t.category )
				.map( t => t.category )
		) ).map( cat => ( {
			label: getCategoryLabel( cat ),
			value: cat
		} ) )
	];

	// Filter templates by category and search.
	const filteredTemplates = templates.filter( ( template ) => {
		const matchesType = template.type === activeTab;
		const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
		const matchesSearch = searchQuery === '' ||
			( template.title && template.title.toLowerCase().includes( searchQuery.toLowerCase() ) ) ||
			( template.name && template.name.toLowerCase().includes( searchQuery.toLowerCase() ) );

		return matchesType && matchesCategory && matchesSearch;
	} );

	return (
		<Modal
			onRequestClose={ onClose }
			className="gutenx-template-modal"
			isFullScreen
		>
			{/* Custom Top Bar */}
			<div className="gutenx-template-modal__custom-header">
				<div className="gutenx-template-modal__logo">
					<Icon icon={ layout } />
					<span>bBlocks</span>
				</div>
				<div className="gutenx-template-modal__tabs">
					<button
						className={ `gutenx-template-modal__tab ${ activeTab === 'block' ? 'is-active' : '' }` }
						onClick={ () => setActiveTab( 'block' ) }
					>
						{ __( 'Patterns', 'gutenx-blocks' ) }
					</button>
					<button
						className={ `gutenx-template-modal__tab ${ activeTab === 'page' ? 'is-active' : '' }` }
						onClick={ () => setActiveTab( 'page' ) }
					>
						{ __( 'Pages', 'gutenx-blocks' ) }
					</button>
				</div>
				<div className="gutenx-template-modal__close">
					<Button icon={ close } onClick={ onClose } />
				</div>
			</div>

			{/* Main Content Area */}
			<div className="gutenx-template-modal__body">
				{/* Left Sidebar */}
				<div className="gutenx-template-modal__sidebar">
					<div className="gutenx-template-modal__search">
						<SearchControl
							value={ searchQuery }
							onChange={ setSearchQuery }
							placeholder={ __( 'Search', 'gutenx-blocks' ) }
						/>
					</div>
					<ul className="gutenx-template-modal__categories">
						{ dynamicCategories.map( ( cat ) => (
							<li key={ cat.value }>
								<button
									className={ `gutenx-template-modal__category-btn ${ activeCategory === cat.value ? 'is-active' : '' }` }
									onClick={ () => setActiveCategory( cat.value ) }
								>
									{ cat.label }
								</button>
							</li>
						) ) }
					</ul>
				</div>

				{/* Right Grid Content */}
				<div className="gutenx-template-modal__content">
					<div className="gutenx-template-modal__grid">
						{ isLoading ? (
							<div className="gutenx-template-modal__loading" style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px', gridColumn: '1 / -1' } }>
								<Spinner />
							</div>
						) : error ? (
							<div className="gutenx-template-modal__error" style={ { color: '#cc1818', textAlign: 'center', padding: '24px', gridColumn: '1 / -1' } }>
								<p>{ __( 'Error loading templates:', 'gutenx-blocks' ) } { error }</p>
							</div>
						) : filteredTemplates.length === 0 ? (
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
				</div>
			</div>
		</Modal>
	);
};

export default TemplateLibrary;
