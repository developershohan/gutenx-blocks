/**
 * GutenX Blocks — Editor Entry Point
 *
 * Registers shared editor utilities, controls, and template library.
 *
 * @package GutenX_Blocks
 */

// Import shared control styles.
import './controls/controls.scss';

// Export controls for block imports.
export {
	SpacingPanel,
	getSpacingStyle,
	getSpacingCSS,
	TypographyPanel,
	getTypographyStyle,
	getTypographyCSS,
	BackgroundPanel,
	getBackgroundStyle,
	getBackgroundCSS,
	BorderPanel,
	getBorderStyle,
	getBorderCSS,
	InspectorTabs,
} from './controls';

export { default as useBlockStyles } from './hooks/useBlockStyles';

// Template Library — registers the plugin toolbar button.
import './templates/TemplateLibraryButton';
import './templates/template-library.scss';
