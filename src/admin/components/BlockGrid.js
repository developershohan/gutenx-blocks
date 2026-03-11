/**
 * BlockGrid Component
 *
 * Renders a responsive grid of block toggle cards.
 *
 * @package GutenX_Blocks
 */

import { useSelect, useDispatch } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { STORE_NAME } from '../store';
import BlockCard from './BlockCard';

/**
 * Block metadata — labels, descriptions, and icons for each block.
 */
const BLOCK_META = {
	'gutenx-blocks/advanced-heading': {
		label: 'Advanced Heading',
		description: 'Advanced heading with typography controls',
		icon: '🅷',
	},
	'gutenx-blocks/advanced-button': {
		label: 'Advanced Button',
		description: 'Customizable button with hover effects',
		icon: '🅱',
	},
	'gutenx-blocks/container': {
		label: 'Container',
		description: 'Wrapper block with flex/grid layout',
		icon: '📦',
	},
	'gutenx-blocks/row': {
		label: 'Row',
		description: 'Horizontal row with gap and alignment controls',
		icon: '⬛',
	},
	'gutenx-blocks/icon-box': {
		label: 'Icon Box',
		description: 'Icon with heading and description',
		icon: '💡',
	},
	'gutenx-blocks/testimonial': {
		label: 'Testimonial',
		description: 'Customer quote with avatar and name',
		icon: '💬',
	},
	'gutenx-blocks/image-gallery': {
		label: 'Image Gallery',
		description: 'Responsive image gallery grid',
		icon: '🖼',
	},
};

const BlockGrid = () => {
	const { blocks, isLoading, isSaving } = useSelect( ( select ) => ( {
		blocks: select( STORE_NAME ).getBlocks(),
		isLoading: select( STORE_NAME ).getIsLoading(),
		isSaving: select( STORE_NAME ).getIsSaving(),
	} ) );

	const { toggleBlock } = useDispatch( STORE_NAME );

	if ( isLoading ) {
		return (
			<div className="gutenx-grid__loading">
				<Spinner />
				<p>{ __( 'Loading blocks…', 'gutenx-blocks' ) }</p>
			</div>
		);
	}

	const blockEntries = Object.entries( blocks );

	return (
		<div className="gutenx-grid">
			<h2 className="gutenx-grid__title">
				{ __( 'Core Blocks', 'gutenx-blocks' ) }
			</h2>

			<div className="gutenx-grid__cards">
				{ blockEntries.map( ( [ slug, isEnabled ] ) => {
					const meta = BLOCK_META[ slug ] || {
						label: slug,
						description: '',
						icon: '🔲',
					};

					return (
						<BlockCard
							key={ slug }
							slug={ slug }
							label={ meta.label }
							description={ meta.description }
							icon={ meta.icon }
							isEnabled={ isEnabled }
							onToggle={ () => toggleBlock( slug ) }
							disabled={ isSaving }
						/>
					);
				} ) }
			</div>

			{ /* PRO_HOOK: Reserved section for "Pro Blocks" locked cards */ }
			<div className="gutenx-grid__pro-section">
				<h2 className="gutenx-grid__title gutenx-grid__title--pro">
					{ __( 'Pro Blocks', 'gutenx-blocks' ) }
					<span className="gutenx-grid__pro-badge">
						{ __( 'Coming Soon', 'gutenx-blocks' ) }
					</span>
				</h2>
			</div>
		</div>
	);
};

export default BlockGrid;
