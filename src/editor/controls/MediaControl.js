/**
 * MediaControl — WordPress Media Uploader
 *
 * Self-managing media uploader with preview thumbnail.
 * Stores an object { url, id, alt } in the attribute.
 *
 * Usage:
 *   <MediaControl
 *       label="Background Image"
 *       attrName="backgroundImage"
 *       attributes={ attributes }
 *       setAttributes={ setAttributes }
 *   />
 *
 * @package GutenX_Blocks
 */

import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

const MediaControl = ( {
	label,
	attrName,
	attributes,
	setAttributes,
	allowedTypes = [ 'image' ],
} ) => {
	const media = attributes[ attrName ] || { url: '', id: 0, alt: '' };

	const onSelect = ( selected ) => {
		setAttributes( {
			[ attrName ]: {
				url: selected.url,
				id: selected.id,
				alt: selected.alt || '',
			},
		} );
	};

	const onRemove = () => {
		setAttributes( {
			[ attrName ]: { url: '', id: 0, alt: '' },
		} );
	};

	return (
		<div className="gutenx-media-control">
			<span className="gutenx-responsive-control__label">{ label }</span>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ onSelect }
					allowedTypes={ allowedTypes }
					value={ media.id }
					render={ ( { open } ) => (
						<div className="gutenx-media-control__preview">
							{ media.url ? (
								<>
									<img
										src={ media.url }
										alt={ media.alt }
										className="gutenx-media-control__thumb"
									/>
									<div className="gutenx-media-control__actions">
										<Button
											variant="secondary"
											isSmall
											onClick={ open }
										>
											{ __( 'Replace', 'gutenx-blocks' ) }
										</Button>
										<Button
											variant="tertiary"
											isSmall
											isDestructive
											onClick={ onRemove }
										>
											{ __( 'Remove', 'gutenx-blocks' ) }
										</Button>
									</div>
								</>
							) : (
								<Button
									variant="secondary"
									onClick={ open }
									className="gutenx-media-control__upload-btn"
								>
									{ __( 'Upload / Select', 'gutenx-blocks' ) }
								</Button>
							) }
						</div>
					) }
				/>
			</MediaUploadCheck>
		</div>
	);
};

export default MediaControl;
