/**
 * Showcase Flex — Editor block registrations.
 *
 * Provides fully editable sidebar controls and live canvas previews
 * for all 10 custom blocks. No build step required.
 */
( function () {
	/* ---------------------------------------------------------------
	 * Section 1: WordPress global aliases
	 * ------------------------------------------------------------- */
	var el                = wp.element.createElement;
	var Fragment          = wp.element.Fragment;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps     = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var MediaUpload       = wp.blockEditor.MediaUpload;
	var MediaUploadCheck  = wp.blockEditor.MediaUploadCheck;
	var PanelBody         = wp.components.PanelBody;
	var TextControl       = wp.components.TextControl;
	var TextareaControl   = wp.components.TextareaControl;
	var Button            = wp.components.Button;
	var Placeholder       = wp.components.Placeholder;
	var __                = wp.i18n.__;

	/* ---------------------------------------------------------------
	 * Section 2: Shared helpers
	 * ------------------------------------------------------------- */

	// Pure array mutation utils — all return new arrays.
	function updateItem( items, index, key, value ) {
		return items.map( function ( item, i ) {
			if ( i !== index ) return item;
			var copy = {};
			for ( var k in item ) copy[ k ] = item[ k ];
			copy[ key ] = value;
			return copy;
		} );
	}

	function removeItem( items, index ) {
		return items.filter( function ( _, i ) { return i !== index; } );
	}

	function moveItem( items, from, to ) {
		if ( to < 0 || to >= items.length ) return items;
		var arr = items.slice();
		var moved = arr.splice( from, 1 )[ 0 ];
		arr.splice( to, 0, moved );
		return arr;
	}

	/**
	 * mediaPickerControl — Reusable media picker for the sidebar.
	 *
	 * @param {Object}   config
	 * @param {string}   config.label     - Panel label
	 * @param {string}   config.url       - Current media URL
	 * @param {Function} config.onSelect  - Receives media object
	 * @param {Function} config.onRemove  - Called to clear the URL
	 * @param {string[]} config.allowedTypes - e.g. ['image'] or ['video']
	 */
	function mediaPickerControl( config ) {
		var label        = config.label || 'Media';
		var url          = config.url || '';
		var onSelect     = config.onSelect;
		var onRemove     = config.onRemove;
		var allowedTypes = config.allowedTypes || [ 'image' ];
		var isVideo      = allowedTypes.indexOf( 'video' ) !== -1;

		return el( PanelBody, { title: label, initialOpen: false },
			el( MediaUploadCheck, null,
				el( MediaUpload, {
					onSelect: function ( media ) {
						onSelect( media );
					},
					allowedTypes: allowedTypes,
					render: function ( renderProps ) {
						if ( url ) {
							return el( Fragment, null,
								isVideo
									? el( 'video', { src: url, style: { width: '100%', marginBottom: '8px' }, controls: true } )
									: el( 'img', { src: url, alt: '', style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } } ),
								el( Button, { variant: 'secondary', onClick: renderProps.open, style: { marginRight: '8px' } }, 'Replace' ),
								el( Button, { isDestructive: true, variant: 'link', onClick: onRemove }, 'Remove' )
							);
						}
						return el( Button, { variant: 'secondary', onClick: renderProps.open }, 'Select ' + label );
					},
				} )
			)
		);
	}

	/**
	 * repeaterControl — Generic repeater for array attributes.
	 *
	 * @param {Object}   config
	 * @param {string}   config.label       - Panel label
	 * @param {Array}    config.items       - Current array of items
	 * @param {Function} config.setItems    - Receives new array
	 * @param {Object}   config.template    - Default values for new item
	 * @param {Function} config.renderItem  - (item, index, onChange) => element array
	 */
	function repeaterControl( config ) {
		var label      = config.label || 'Items';
		var items      = config.items || [];
		var setItems   = config.setItems;
		var template   = config.template || {};
		var renderItem = config.renderItem;

		var children = items.map( function ( item, index ) {
			var itemTitle = label + ' ' + ( index + 1 );

			function onChange( key, value ) {
				setItems( updateItem( items, index, key, value ) );
			}

			return el( PanelBody, { key: index, title: itemTitle, initialOpen: false },
				renderItem( item, index, onChange ),
				el( 'div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
					el( Button, {
						variant: 'secondary',
						size: 'small',
						disabled: index === 0,
						onClick: function () { setItems( moveItem( items, index, index - 1 ) ); },
					}, 'Move Up' ),
					el( Button, {
						variant: 'secondary',
						size: 'small',
						disabled: index === items.length - 1,
						onClick: function () { setItems( moveItem( items, index, index + 1 ) ); },
					}, 'Move Down' ),
					el( Button, {
						isDestructive: true,
						variant: 'link',
						size: 'small',
						onClick: function () { setItems( removeItem( items, index ) ); },
					}, 'Remove' )
				)
			);
		} );

		children.push(
			el( Button, {
				key: 'add',
				variant: 'secondary',
				onClick: function () {
					var newItem = {};
					for ( var k in template ) newItem[ k ] = template[ k ];
					setItems( items.concat( [ newItem ] ) );
				},
				style: { marginTop: '8px' },
			}, 'Add ' + label )
		);

		return children;
	}

	/* ---------------------------------------------------------------
	 * Section 3: Edit functions for each block
	 * ------------------------------------------------------------- */

	/* --- progress-bar --- */
	function editProgressBar() {
		var blockProps = useBlockProps( {
			style: { position: 'relative', zIndex: 0 },
		} );

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Reading Progress Bar' },
					el( 'p', null, 'This block renders a reading progress bar fixed to the top of the viewport. It has no configurable attributes — it activates automatically on the front end.' )
				)
			),
			el( 'div', blockProps,
				el( 'div', {
					className: 'sf-progress-bar',
					style: { position: 'relative', height: '3px', background: 'var(--sf-surface-alt, #e5e7eb)' },
				},
					el( 'div', {
						className: 'sf-progress-bar__fill',
						style: { width: '45%', height: '100%', background: 'var(--sf-accent, #2563eb)' },
					} )
				)
			)
		);
	}

	/* --- dark-mode-toggle --- */
	function editDarkModeToggle() {
		var blockProps = useBlockProps();

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Dark Mode Toggle' },
					el( 'p', null, 'This block renders a dark/light mode toggle button. It has no configurable attributes — it works automatically on the front end via localStorage.' )
				)
			),
			el( 'div', blockProps,
				el( 'button', {
					className: 'sf-theme-toggle',
					type: 'button',
					style: { pointerEvents: 'none' },
					'aria-label': 'Toggle dark mode',
				},
					el( 'svg', { className: 'sf-theme-toggle__icon sf-theme-toggle__moon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', width: 20, height: 20 },
						el( 'path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' } )
					),
					el( 'span', null, 'Theme' )
				)
			)
		);
	}

	/* --- pull-quote-animated --- */
	function editPullQuoteAnimated( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps();

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Quote Content' },
					el( TextareaControl, {
						label: 'Quote',
						value: attrs.quote,
						onChange: function ( v ) { setAttrs( { quote: v } ); },
					} ),
					el( TextControl, {
						label: 'Attribution',
						value: attrs.attribution,
						onChange: function ( v ) { setAttrs( { attribution: v } ); },
					} )
				)
			),
			el( 'aside', Object.assign( {}, blockProps, { className: ( blockProps.className || '' ) + ' sf-pull-quote' } ),
				el( 'div', { className: 'sf-pull-quote__bg', 'aria-hidden': 'true' } ),
				el( 'blockquote', { className: 'sf-pull-quote__text' },
					attrs.quote || 'Enter a quote...'
				),
				attrs.attribution
					? el( 'cite', { className: 'sf-pull-quote__attribution' }, '\u2014 ' + attrs.attribution )
					: null
			)
		);
	}

	/* --- image-reveal --- */
	function editImageReveal( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps();

		return el( Fragment, null,
			el( InspectorControls, null,
				mediaPickerControl( {
					label: 'Image',
					url: attrs.imageUrl,
					onSelect: function ( media ) { setAttrs( { imageUrl: media.url } ); },
					onRemove: function () { setAttrs( { imageUrl: '' } ); },
				} ),
				el( PanelBody, { title: 'Image Details', initialOpen: false },
					el( TextControl, {
						label: 'Alt Text',
						value: attrs.alt,
						onChange: function ( v ) { setAttrs( { alt: v } ); },
					} ),
					el( TextControl, {
						label: 'Credit',
						value: attrs.credit,
						onChange: function ( v ) { setAttrs( { credit: v } ); },
					} ),
					el( TextControl, {
						label: 'Caption',
						value: attrs.caption,
						onChange: function ( v ) { setAttrs( { caption: v } ); },
					} )
				)
			),
			el( 'figure', Object.assign( {}, blockProps, { className: ( blockProps.className || '' ) + ' sf-image-reveal' } ),
				attrs.imageUrl
					? el( Fragment, null,
						el( 'img', { src: attrs.imageUrl, alt: attrs.alt || '', style: { width: '100%', height: 'auto', display: 'block' } } ),
						attrs.credit
							? el( 'span', { className: 'sf-image-reveal__credit' }, attrs.credit )
							: null,
						attrs.caption
							? el( 'figcaption', { style: { padding: '0.75rem 0', fontSize: '0.85rem', color: 'var(--sf-text-muted, #6b7280)', textAlign: 'center' } }, attrs.caption )
							: null
					)
					: el( Placeholder, { icon: 'format-image', label: 'Image Reveal', instructions: 'Select an image from the sidebar panel.' } )
			)
		);
	}

	/* --- before-after-slider --- */
	function editBeforeAfterSlider( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps();

		var hasImages = attrs.beforeImage && attrs.afterImage;

		return el( Fragment, null,
			el( InspectorControls, null,
				mediaPickerControl( {
					label: 'Before Image',
					url: attrs.beforeImage,
					onSelect: function ( media ) { setAttrs( { beforeImage: media.url } ); },
					onRemove: function () { setAttrs( { beforeImage: '' } ); },
				} ),
				mediaPickerControl( {
					label: 'After Image',
					url: attrs.afterImage,
					onSelect: function ( media ) { setAttrs( { afterImage: media.url } ); },
					onRemove: function () { setAttrs( { afterImage: '' } ); },
				} ),
				el( PanelBody, { title: 'Labels', initialOpen: false },
					el( TextControl, {
						label: 'Before Label',
						value: attrs.beforeLabel,
						onChange: function ( v ) { setAttrs( { beforeLabel: v } ); },
					} ),
					el( TextControl, {
						label: 'After Label',
						value: attrs.afterLabel,
						onChange: function ( v ) { setAttrs( { afterLabel: v } ); },
					} )
				)
			),
			el( 'div', blockProps,
				hasImages
					? el( 'div', {
						style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
					},
						el( 'div', null,
							el( 'div', { style: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--sf-text-muted, #6b7280)' } }, attrs.beforeLabel || 'Before' ),
							el( 'img', { src: attrs.beforeImage, alt: attrs.beforeLabel || 'Before', style: { width: '100%', height: 'auto', borderRadius: '4px' } } )
						),
						el( 'div', null,
							el( 'div', { style: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--sf-text-muted, #6b7280)' } }, attrs.afterLabel || 'After' ),
							el( 'img', { src: attrs.afterImage, alt: attrs.afterLabel || 'After', style: { width: '100%', height: 'auto', borderRadius: '4px' } } )
						)
					)
					: el( Placeholder, { icon: 'image-flip-horizontal', label: 'Before/After Slider', instructions: 'Select before and after images from the sidebar panels.' } )
			)
		);
	}

	/* --- parallax-hero --- */
	function editParallaxHero( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps( {
			className: 'sf-parallax-hero',
			style: { position: 'relative', minHeight: '60vh', overflow: 'hidden' },
		} );

		return el( Fragment, null,
			el( InspectorControls, null,
				mediaPickerControl( {
					label: 'Background Image',
					url: attrs.imageUrl,
					onSelect: function ( media ) { setAttrs( { imageUrl: media.url } ); },
					onRemove: function () { setAttrs( { imageUrl: '' } ); },
				} ),
				el( PanelBody, { title: 'Hero Text' },
					el( TextControl, {
						label: 'Kicker',
						value: attrs.kicker,
						onChange: function ( v ) { setAttrs( { kicker: v } ); },
					} ),
					el( TextControl, {
						label: 'Title',
						value: attrs.title,
						onChange: function ( v ) { setAttrs( { title: v } ); },
					} ),
					el( TextControl, {
						label: 'Subtitle',
						value: attrs.subtitle,
						onChange: function ( v ) { setAttrs( { subtitle: v } ); },
					} ),
					el( TextControl, {
						label: 'Byline',
						value: attrs.byline,
						onChange: function ( v ) { setAttrs( { byline: v } ); },
					} ),
					el( TextControl, {
						label: 'Dateline',
						value: attrs.dateline,
						onChange: function ( v ) { setAttrs( { dateline: v } ); },
					} )
				)
			),
			el( 'section', blockProps,
				el( 'div', { className: 'sf-parallax-hero__media' },
					attrs.imageUrl
						? el( 'img', { src: attrs.imageUrl, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 } } )
						: el( 'div', { style: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' } } )
				),
				el( 'div', { className: 'sf-parallax-hero__overlay' } ),
				el( 'div', { className: 'sf-parallax-hero__content', style: { position: 'relative', zIndex: 2 } },
					attrs.kicker
						? el( 'span', { className: 'sf-parallax-hero__kicker' }, attrs.kicker )
						: null,
					el( 'h1', { className: 'sf-parallax-hero__title' }, attrs.title || 'Enter a title...' ),
					attrs.subtitle
						? el( 'p', { className: 'sf-parallax-hero__subtitle' }, attrs.subtitle )
						: null,
					el( 'div', { className: 'sf-parallax-hero__meta' },
						attrs.byline
							? el( 'span', null, el( 'strong', null, attrs.byline ) )
							: null,
						attrs.dateline
							? el( 'span', { className: 'sf-dateline' }, attrs.dateline )
							: null
					)
				)
			)
		);
	}

	/* --- video-background --- */
	function editVideoBackground( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps( {
			className: 'sf-video-section',
			style: { position: 'relative', minHeight: '50vh', overflow: 'hidden' },
		} );

		return el( Fragment, null,
			el( InspectorControls, null,
				mediaPickerControl( {
					label: 'Video',
					url: attrs.videoUrl,
					allowedTypes: [ 'video' ],
					onSelect: function ( media ) { setAttrs( { videoUrl: media.url } ); },
					onRemove: function () { setAttrs( { videoUrl: '' } ); },
				} ),
				mediaPickerControl( {
					label: 'Poster Image',
					url: attrs.posterUrl,
					onSelect: function ( media ) { setAttrs( { posterUrl: media.url } ); },
					onRemove: function () { setAttrs( { posterUrl: '' } ); },
				} ),
				el( PanelBody, { title: 'Content' },
					el( TextControl, {
						label: 'Title',
						value: attrs.title,
						onChange: function ( v ) { setAttrs( { title: v } ); },
					} ),
					el( TextareaControl, {
						label: 'Text',
						value: attrs.text,
						onChange: function ( v ) { setAttrs( { text: v } ); },
					} )
				)
			),
			el( 'section', blockProps,
				el( 'div', {
					className: 'sf-video-section__media',
					style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
				},
					attrs.posterUrl
						? el( 'img', { src: attrs.posterUrl, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover' } } )
						: el( 'div', { style: {
							width: '100%',
							height: '100%',
							background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						} },
							el( 'svg', { width: 48, height: 48, viewBox: '0 0 24 24', fill: 'none', stroke: 'rgba(255,255,255,0.4)', strokeWidth: '1.5' },
								el( 'polygon', { points: '5 3 19 12 5 21 5 3' } )
							)
						)
				),
				el( 'div', { className: 'sf-video-section__overlay' } ),
				el( 'div', {
					className: 'sf-video-section__content',
					style: { position: 'relative', zIndex: 2 },
				},
					el( 'h2', { className: 'sf-video-section__title' }, attrs.title || 'Enter a title...' ),
					attrs.text
						? el( 'p', { className: 'sf-video-section__text' }, attrs.text )
						: null
				)
			)
		);
	}

	/* --- scroll-nav --- */
	function editScrollNav( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps( {
			className: 'sf-sticky-nav',
			style: { position: 'relative', zIndex: 0 },
		} );

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Navigation Settings' },
					el( TextControl, {
						label: 'Brand Text',
						value: attrs.brand,
						onChange: function ( v ) { setAttrs( { brand: v } ); },
					} )
				),
				el( PanelBody, { title: 'Sections', initialOpen: true },
					repeaterControl( {
						label: 'Section',
						items: attrs.sections,
						setItems: function ( v ) { setAttrs( { sections: v } ); },
						template: { id: '', label: '' },
						renderItem: function ( item, index, onChange ) {
							return el( Fragment, null,
								el( TextControl, {
									label: 'Section ID',
									value: item.id,
									onChange: function ( v ) { onChange( 'id', v ); },
								} ),
								el( TextControl, {
									label: 'Label',
									value: item.label,
									onChange: function ( v ) { onChange( 'label', v ); },
								} )
							);
						},
					} )
				)
			),
			el( 'nav', blockProps,
				el( 'div', { className: 'sf-sticky-nav__inner' },
					el( 'span', { className: 'sf-sticky-nav__brand' }, attrs.brand || 'Brand' ),
					attrs.sections && attrs.sections.length
						? el( 'ul', { className: 'sf-sticky-nav__links' },
							attrs.sections.map( function ( sec, i ) {
								return el( 'li', { key: i },
									el( 'span', { className: 'sf-sticky-nav__link', style: { cursor: 'default' } }, sec.label )
								);
							} )
						)
						: null
				)
			)
		);
	}

	/* --- animated-counter --- */
	function editAnimatedCounter( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps( {
			className: 'sf-counter-section sf-section',
		} );

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Counters', initialOpen: true },
					repeaterControl( {
						label: 'Counter',
						items: attrs.counters,
						setItems: function ( v ) { setAttrs( { counters: v } ); },
						template: { value: 0, suffix: '', label: '' },
						renderItem: function ( item, index, onChange ) {
							return el( Fragment, null,
								el( TextControl, {
									label: 'Value',
									type: 'number',
									value: String( item.value ),
									onChange: function ( v ) { onChange( 'value', parseInt( v, 10 ) || 0 ); },
								} ),
								el( TextControl, {
									label: 'Suffix',
									value: item.suffix,
									onChange: function ( v ) { onChange( 'suffix', v ); },
								} ),
								el( TextControl, {
									label: 'Label',
									value: item.label,
									onChange: function ( v ) { onChange( 'label', v ); },
								} )
							);
						},
					} )
				)
			),
			el( 'section', blockProps,
				attrs.counters && attrs.counters.length
					? el( 'div', { className: 'sf-counter-grid' },
						attrs.counters.map( function ( counter, i ) {
							return el( 'div', { key: i, className: 'sf-counter-card', style: { opacity: 1, transform: 'none' } },
								el( 'div', { className: 'sf-counter__number' },
									counter.value + ( counter.suffix || '' )
								),
								el( 'div', { className: 'sf-counter__label' }, counter.label )
							);
						} )
					)
					: el( Placeholder, { icon: 'chart-bar', label: 'Animated Counter Section', instructions: 'Add counters from the sidebar panel.' } )
			)
		);
	}

	/* --- horizontal-scroll --- */
	function editHorizontalScroll( props ) {
		var attrs      = props.attributes;
		var setAttrs   = props.setAttributes;
		var blockProps = useBlockProps();

		return el( Fragment, null,
			el( InspectorControls, null,
				el( PanelBody, { title: 'Cards', initialOpen: true },
					repeaterControl( {
						label: 'Card',
						items: attrs.cards,
						setItems: function ( v ) { setAttrs( { cards: v } ); },
						template: { chapter: '', title: '', excerpt: '', image: '' },
						renderItem: function ( item, index, onChange ) {
							return el( Fragment, null,
								el( TextControl, {
									label: 'Chapter',
									value: item.chapter,
									onChange: function ( v ) { onChange( 'chapter', v ); },
								} ),
								el( TextControl, {
									label: 'Title',
									value: item.title,
									onChange: function ( v ) { onChange( 'title', v ); },
								} ),
								el( TextareaControl, {
									label: 'Excerpt',
									value: item.excerpt,
									onChange: function ( v ) { onChange( 'excerpt', v ); },
								} ),
								el( 'div', { style: { marginTop: '8px' } },
									el( MediaUploadCheck, null,
										el( MediaUpload, {
											onSelect: function ( media ) { onChange( 'image', media.url ); },
											allowedTypes: [ 'image' ],
											render: function ( renderProps ) {
												if ( item.image ) {
													return el( Fragment, null,
														el( 'img', { src: item.image, alt: '', style: { width: '100%', marginBottom: '8px', borderRadius: '4px' } } ),
														el( Button, { variant: 'secondary', onClick: renderProps.open, size: 'small', style: { marginRight: '8px' } }, 'Replace Image' ),
														el( Button, { isDestructive: true, variant: 'link', size: 'small', onClick: function () { onChange( 'image', '' ); } }, 'Remove' )
													);
												}
												return el( Button, { variant: 'secondary', onClick: renderProps.open, size: 'small' }, 'Select Image' );
											},
										} )
									)
								)
							);
						},
					} )
				)
			),
			el( 'div', blockProps,
				attrs.cards && attrs.cards.length
					? el( 'div', {
						style: {
							display: 'flex',
							gap: '24px',
							overflowX: 'auto',
							padding: '16px 0',
						},
					},
						attrs.cards.map( function ( card, i ) {
							return el( 'article', {
								key: i,
								className: 'sf-horizontal-scroll__card',
								style: {
									flex: '0 0 300px',
									border: '1px solid var(--sf-border, #e5e7eb)',
									borderRadius: 'var(--sf-radius-lg, 12px)',
									overflow: 'hidden',
									background: 'var(--sf-surface, #fff)',
								},
							},
								card.image
									? el( 'img', {
										className: 'sf-horizontal-scroll__card-image',
										src: card.image,
										alt: '',
										style: { width: '100%', height: '160px', objectFit: 'cover' },
									} )
									: null,
								el( 'div', {
									className: 'sf-horizontal-scroll__card-body',
									style: { padding: '16px' },
								},
									card.chapter
										? el( 'div', { className: 'sf-horizontal-scroll__card-chapter' }, card.chapter )
										: null,
									el( 'h3', { className: 'sf-horizontal-scroll__card-title', style: { margin: '4px 0 8px' } }, card.title || 'Untitled' ),
									card.excerpt
										? el( 'p', { className: 'sf-horizontal-scroll__card-excerpt', style: { fontSize: '0.9rem', margin: 0 } }, card.excerpt )
										: null
								)
							);
						} )
					)
					: el( Placeholder, { icon: 'slides', label: 'Horizontal Scroll Timeline', instructions: 'Add cards from the sidebar panel.' } )
			)
		);
	}

	/* ---------------------------------------------------------------
	 * Section 4: Block registrations
	 * ------------------------------------------------------------- */

	registerBlockType( 'showcase-flex/progress-bar', {
		edit: editProgressBar,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/dark-mode-toggle', {
		edit: editDarkModeToggle,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/pull-quote-animated', {
		edit: editPullQuoteAnimated,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/image-reveal', {
		edit: editImageReveal,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/before-after-slider', {
		edit: editBeforeAfterSlider,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/parallax-hero', {
		edit: editParallaxHero,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/video-background', {
		edit: editVideoBackground,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/scroll-nav', {
		edit: editScrollNav,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/animated-counter', {
		edit: editAnimatedCounter,
		save: function () { return null; },
	} );

	registerBlockType( 'showcase-flex/horizontal-scroll', {
		edit: editHorizontalScroll,
		save: function () { return null; },
	} );
} )();
