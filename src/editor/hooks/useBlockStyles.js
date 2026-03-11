/**
 * useBlockStyles — Combines all CSS helper outputs
 *
 * Custom hook that merges outputs from all style helper functions.
 *
 * @package GutenX_Blocks
 */

import { useMemo } from '@wordpress/element';
import { getSpacingStyle, getSpacingCSS } from '../controls/SpacingPanel';
import { getTypographyStyle, getTypographyCSS } from '../controls/TypographyPanel';
import { getBackgroundStyle, getBackgroundCSS } from '../controls/BackgroundPanel';
import { getBorderStyle, getBorderCSS } from '../controls/BorderPanel';

/**
 * useBlockStyles hook.
 *
 * Merges all CSS helper outputs into one composite style object.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Combined styles: { inlineStyle, cssVars, className }
 */
const useBlockStyles = ( attributes ) => {
	return useMemo( () => {
		// Merge all inline styles.
		const inlineStyle = {
			...getSpacingStyle( attributes ),
			...getTypographyStyle( attributes ),
			...getBackgroundStyle( attributes ),
			...getBorderStyle( attributes ),
		};

		// Merge all CSS custom properties.
		const cssVars = {
			...getSpacingCSS( attributes ),
			...getTypographyCSS( attributes ),
			...getBackgroundCSS( attributes ),
			...getBorderCSS( attributes ),
		};

		// Build dynamic class names.
		const classes = [ 'gutenx-block' ];

		if ( attributes.textAlign ) {
			classes.push( `has-text-align-${ attributes.textAlign }` );
		}

		if ( attributes.backgroundType && attributes.backgroundType !== 'color' ) {
			classes.push( `has-${ attributes.backgroundType }-background` );
		}

		const className = classes.join( ' ' );

		return { inlineStyle, cssVars, className };
	}, [ attributes ] );
};

export default useBlockStyles;
