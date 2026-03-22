/**
 * Responsive Helpers — Shared Attribute Resolution
 *
 * Core utilities used by all responsive controls. Handles:
 * - Device-specific attribute name resolution
 * - Value fallback chains (mobile → tablet → desktop → default)
 * - Value + unit parsing
 *
 * @package GutenX_Blocks
 */

/* ─── Attribute Key Resolution ─── */

/**
 * Get the attribute key for a given device.
 *
 * @example
 * getResponsiveKey( 'maxWidth', 'desktop' ) → 'maxWidth'
 * getResponsiveKey( 'maxWidth', 'tablet' )  → 'maxWidthTablet'
 * getResponsiveKey( 'maxWidth', 'mobile' )  → 'maxWidthMobile'
 *
 * @param {string} attrName Base attribute name.
 * @param {string} device   Device slug.
 * @return {string} Full attribute key.
 */
export const getResponsiveKey = ( attrName, device ) => {
	if ( device === 'desktop' ) {
		return attrName;
	}
	return `${ attrName }${ device.charAt( 0 ).toUpperCase() + device.slice( 1 ) }`;
};

/* ─── Value Resolution ─── */

/**
 * Read attribute value with fallback chain.
 *
 * mobile → tablet → desktop → defaultValue
 *
 * @param {Object} attributes   Block attributes.
 * @param {string} attrName     Base attribute name.
 * @param {string} device       Current device.
 * @param {string} defaultValue Fallback if no value found.
 * @return {string} Resolved value.
 */
export const getResponsiveValue = ( attributes, attrName, device, defaultValue = '' ) => {
	const desktopVal = attributes[ attrName ] ?? defaultValue;

	if ( device === 'desktop' ) {
		return desktopVal;
	}

	const tabletKey = getResponsiveKey( attrName, 'tablet' );
	const tabletVal = attributes[ tabletKey ] || desktopVal;

	if ( device === 'tablet' ) {
		return tabletVal;
	}

	// mobile → tablet → desktop
	const mobileKey = getResponsiveKey( attrName, 'mobile' );
	return attributes[ mobileKey ] || tabletVal;
};

/* ─── Value + Unit Parsing ─── */

const UNIT_REGEX = /^(-?\d*\.?\d+)\s*(px|rem|em|%|vw|vh|vmin|vmax)?$/;

/**
 * Parse "16px" → { num: 16, unit: "px" }.
 *
 * @param {string} value CSS value string.
 * @param {string} defaultUnit Unit to use if none found.
 * @return {{ num: number, unit: string }}
 */
export const parseValueUnit = ( value, defaultUnit = 'px' ) => {
	if ( ! value && value !== 0 ) {
		return { num: '', unit: defaultUnit };
	}
	const str = String( value ).trim();
	const match = str.match( UNIT_REGEX );
	if ( match ) {
		return {
			num: parseFloat( match[ 1 ] ),
			unit: match[ 2 ] || defaultUnit,
		};
	}
	// If it's just a number
	const numOnly = parseFloat( str );
	if ( ! isNaN( numOnly ) ) {
		return { num: numOnly, unit: defaultUnit };
	}
	return { num: '', unit: defaultUnit };
};

/**
 * Combine number + unit → "16px".
 *
 * @param {number|string} num  Numeric value.
 * @param {string}        unit CSS unit.
 * @return {string} Combined value.
 */
export const combineValueUnit = ( num, unit ) => {
	if ( num === '' || num === undefined || num === null ) {
		return '';
	}
	return `${ num }${ unit }`;
};
