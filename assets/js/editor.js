/**
 * Showcase Flex — Editor block registrations.
 *
 * Registers every custom block with a ServerSideRender edit component
 * so the block editor can display them. No build step required.
 */
( function () {
	var el                = wp.element.createElement;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps     = wp.blockEditor.useBlockProps;
	var ServerSideRender  = wp.serverSideRender;

	var blocks = [
		'showcase-flex/parallax-hero',
		'showcase-flex/progress-bar',
		'showcase-flex/scroll-nav',
		'showcase-flex/animated-counter',
		'showcase-flex/image-reveal',
		'showcase-flex/before-after-slider',
		'showcase-flex/video-background',
		'showcase-flex/horizontal-scroll',
		'showcase-flex/pull-quote-animated',
		'showcase-flex/dark-mode-toggle',
	];

	blocks.forEach( function ( name ) {
		registerBlockType( name, {
			edit: function ( props ) {
				return el(
					'div',
					useBlockProps(),
					el( ServerSideRender, {
						block: name,
						attributes: props.attributes,
					} )
				);
			},
			save: function () {
				return null;
			},
		} );
	} );
} )();
