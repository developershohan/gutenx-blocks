/**
 * Controls Barrel Export
 *
 * Central import for all shared editor control panels and helpers.
 *
 * @package GutenX_Blocks
 */

// ─── Legacy Panels (unchanged) ───
export { default as SpacingPanel, getSpacingStyle, getSpacingCSS } from './SpacingPanel';
export { default as TypographyPanel, getTypographyStyle, getTypographyCSS } from './TypographyPanel';
export { default as BackgroundPanel, getBackgroundStyle, getBackgroundCSS } from './BackgroundPanel';
export { default as BorderPanel, getBorderStyle, getBorderCSS } from './BorderPanel';
export { default as InspectorTabs } from './InspectorTabs';

// ─── Responsive Foundation ───
export { default as ResponsiveDeviceSwitcher, useDeviceType } from './ResponsiveDeviceSwitcher';
export { getResponsiveKey, getResponsiveValue, parseValueUnit, combineValueUnit } from './responsive-helpers';

// ─── Atomic Controls ───
export { default as ResponsiveTextControl } from './ResponsiveTextControl';
export { default as ResponsiveRangeControl } from './ResponsiveRangeControl';
export { default as ResponsiveDimensionsControl } from './ResponsiveDimensionsControl';
export { default as ResponsiveSelectControl } from './ResponsiveSelectControl';
export { default as ColorControl } from './ColorControl';
export { default as MediaControl } from './MediaControl';

