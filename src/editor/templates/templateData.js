/**
 * Template Data — 5 Pre-built Templates
 *
 * Each template defines a name, category, preview description,
 * and an array of block configurations that can be inserted.
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';

const templateData = [
	{
		id: 'hero-section',
		name: __( 'Hero Section', 'gutenx-blocks' ),
		category: 'landing',
		description: __( 'Eye-catching hero with heading, subtext, and CTA button.', 'gutenx-blocks' ),
		icon: '🚀',
		isPro: false,
		blocks: [
			[
				'gutenx-blocks/container',
				{
					displayType: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '500px',
					backgroundType: 'gradient',
					backgroundGradient: 'linear-gradient(135deg, #6C3FC5, #4A2A8A)',
					paddingTop: '80px',
					paddingBottom: '80px',
					paddingRight: '24px',
					paddingLeft: '24px',
				},
				[
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'Build Stunning Websites with GutenX',
							level: 1,
							textColor: '#ffffff',
							fontSize: '48px',
							fontWeight: '800',
							textAlign: 'center',
							lineHeight: '1.2',
							marginBottom: '16px',
						},
					],
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'The most powerful Gutenberg block library for WordPress.',
							level: 3,
							textColor: 'rgba(255,255,255,0.85)',
							fontSize: '20px',
							fontWeight: '400',
							textAlign: 'center',
							marginBottom: '32px',
						},
					],
					[
						'gutenx-blocks/advanced-button',
						{
							text: 'Get Started Free',
							buttonSize: 'large',
							backgroundColor: '#FF6B35',
							borderRadius: '50px',
							fontWeight: '700',
						},
					],
				],
			],
		],
	},
	{
		id: 'features-grid',
		name: __( 'Features Grid', 'gutenx-blocks' ),
		category: 'content',
		description: __( '3-column feature grid with icon boxes.', 'gutenx-blocks' ),
		icon: '✨',
		isPro: false,
		blocks: [
			[
				'gutenx-blocks/container',
				{
					displayType: 'block',
					maxWidth: '1100px',
					paddingTop: '64px',
					paddingBottom: '64px',
				},
				[
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'Why Choose Us',
							level: 2,
							textAlign: 'center',
							fontSize: '36px',
							fontWeight: '700',
							marginBottom: '48px',
						},
					],
					[
						'gutenx-blocks/row',
						{ columns: 3, columnGap: '32px', stackOnMobile: true },
						[
							[
								'gutenx-blocks/icon-box',
								{ icon: 'rocket', title: 'Lightning Fast', description: 'Optimized for performance with minimal DOM and zero bloat.', layout: 'top' },
							],
							[
								'gutenx-blocks/icon-box',
								{ icon: 'shield', title: 'Secure by Default', description: 'Built with WordPress security best practices from the ground up.', layout: 'top' },
							],
							[
								'gutenx-blocks/icon-box',
								{ icon: 'gear', title: 'Fully Customizable', description: 'Every block comes with granular controls for spacing, typography, and colors.', layout: 'top' },
							],
						],
					],
				],
			],
		],
	},
	{
		id: 'testimonials-section',
		name: __( 'Testimonials Section', 'gutenx-blocks' ),
		category: 'social-proof',
		description: __( 'Customer testimonials in a 2-column responsive layout.', 'gutenx-blocks' ),
		icon: '💬',
		isPro: false,
		blocks: [
			[
				'gutenx-blocks/container',
				{
					displayType: 'block',
					maxWidth: '1100px',
					paddingTop: '64px',
					paddingBottom: '64px',
					backgroundColor: '#F9FAFB',
				},
				[
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'What Our Customers Say',
							level: 2,
							textAlign: 'center',
							fontSize: '36px',
							fontWeight: '700',
							marginBottom: '40px',
						},
					],
					[
						'gutenx-blocks/row',
						{ columns: 2, columnGap: '24px', stackOnMobile: true },
						[
							[
								'gutenx-blocks/testimonial',
								{
									quote: 'GutenX Blocks completely transformed our website. The controls are intuitive and the output is pixel-perfect.',
									authorName: 'Sarah Johnson',
									authorTitle: 'Creative Director, PixelCraft',
									rating: 5,
									layout: 'card',
								},
							],
							[
								'gutenx-blocks/testimonial',
								{
									quote: "Best block library I've used. Clean code, great performance, and the admin dashboard makes managing blocks a breeze.",
									authorName: 'Michael Chen',
									authorTitle: 'Lead Developer, DevStudio',
									rating: 5,
									layout: 'card',
								},
							],
						],
					],
				],
			],
		],
	},
	{
		id: 'cta-banner',
		name: __( 'CTA Banner', 'gutenx-blocks' ),
		category: 'conversion',
		description: __( 'Bold call-to-action banner with gradient background.', 'gutenx-blocks' ),
		icon: '🎯',
		isPro: false,
		blocks: [
			[
				'gutenx-blocks/container',
				{
					displayType: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundType: 'gradient',
					backgroundGradient: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
					paddingTop: '64px',
					paddingBottom: '64px',
					borderRadius: '16px',
				},
				[
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'Ready to Get Started?',
							level: 2,
							textColor: '#ffffff',
							fontSize: '40px',
							fontWeight: '800',
							textAlign: 'center',
							marginBottom: '12px',
						},
					],
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'Join thousands of creators building beautiful sites with GutenX.',
							level: 4,
							textColor: 'rgba(255,255,255,0.8)',
							fontSize: '18px',
							fontWeight: '400',
							textAlign: 'center',
							marginBottom: '32px',
						},
					],
					[
						'gutenx-blocks/advanced-button',
						{
							text: 'Start Building Now →',
							buttonSize: 'large',
							backgroundColor: '#ffffff',
							textColor: '#6366F1',
							borderRadius: '50px',
							fontWeight: '700',
						},
					],
				],
			],
		],
	},
	{
		id: 'gallery-showcase',
		name: __( 'Gallery Showcase', 'gutenx-blocks' ),
		category: 'content',
		description: __( 'Section heading with an image gallery placeholder.', 'gutenx-blocks' ),
		icon: '🖼',
		isPro: false,
		blocks: [
			[
				'gutenx-blocks/container',
				{
					displayType: 'block',
					maxWidth: '1100px',
					paddingTop: '64px',
					paddingBottom: '64px',
				},
				[
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'Our Portfolio',
							level: 2,
							textAlign: 'center',
							fontSize: '36px',
							fontWeight: '700',
							marginBottom: '12px',
						},
					],
					[
						'gutenx-blocks/advanced-heading',
						{
							content: 'A showcase of our finest work.',
							level: 4,
							textAlign: 'center',
							fontSize: '16px',
							fontWeight: '400',
							textColor: '#6B7280',
							marginBottom: '40px',
						},
					],
					[
						'gutenx-blocks/image-gallery',
						{
							layout: 'grid',
							columns: 3,
							gap: '16px',
							borderRadius: '12px',
							enableLightbox: true,
						},
					],
				],
			],
		],
	},
];

export default templateData;
