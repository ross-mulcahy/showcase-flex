<?php
/**
 * Showcase Flex — Functions and definitions
 *
 * @package ShowcaseFlex
 * @since   1.0.0
 */

declare(strict_types=1);

namespace ShowcaseFlex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SHOWCASE_FLEX_VERSION', '1.0.0' );
define( 'SHOWCASE_FLEX_DIR', get_template_directory() );
define( 'SHOWCASE_FLEX_URI', get_template_directory_uri() );

/**
 * Enqueue front-end assets — deferred, non-blocking.
 */
function enqueue_assets(): void {
	// Core theme stylesheet.
	wp_enqueue_style(
		'showcase-flex-style',
		SHOWCASE_FLEX_URI . '/assets/css/theme.css',
		[],
		SHOWCASE_FLEX_VERSION
	);

	// Main interaction engine — deferred via script_loader_tag filter.
	wp_enqueue_script(
		'showcase-flex-engine',
		SHOWCASE_FLEX_URI . '/assets/js/theme.js',
		[],
		SHOWCASE_FLEX_VERSION,
		[ 'strategy' => 'defer', 'in_footer' => true ]
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );


/**
 * Register all custom blocks from the /blocks directory.
 */
function register_blocks(): void {
	// Shared editor script used by every custom block (referenced via handle in block.json).
	wp_register_script(
		'showcase-flex-editor',
		SHOWCASE_FLEX_URI . '/assets/js/editor.js',
		[ 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ],
		SHOWCASE_FLEX_VERSION,
		true
	);

	$blocks_dir = SHOWCASE_FLEX_DIR . '/blocks';
	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	$block_folders = array_filter( glob( $blocks_dir . '/*' ), 'is_dir' );
	foreach ( $block_folders as $block ) {
		if ( file_exists( $block . '/block.json' ) ) {
			register_block_type( $block );
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\\register_blocks' );

/**
 * Register block patterns and pattern category.
 */
function register_patterns(): void {
	register_block_pattern_category( 'showcase-flex', [
		'label' => __( 'Showcase Flex', 'showcase-flex' ),
	] );
}
add_action( 'init', __NAMESPACE__ . '\\register_patterns' );

/**
 * Add preconnect hints for Google Fonts.
 */
function resource_hints( array $urls, string $relation_type ): array {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = [
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => 'anonymous',
		];
	}
	return $urls;
}
add_filter( 'wp_resource_hints', __NAMESPACE__ . '\\resource_hints', 10, 2 );

/**
 * Add theme support items.
 */
function theme_setup(): void {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'html5', [
		'comment-list',
		'comment-form',
		'search-form',
		'gallery',
		'caption',
		'style',
		'script',
	] );

	// Load theme styles inside the editor iframe so block previews match the front end.
	add_editor_style( 'assets/css/theme.css' );

	// Neutralise animation/visibility rules that depend on front-end JS.
	add_editor_style( 'assets/css/editor-overrides.css' );
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\\theme_setup' );

/**
 * Register a custom block category for Showcase Flex blocks.
 */
function block_categories( array $categories ): array {
	array_unshift( $categories, [
		'slug'  => 'showcase-flex',
		'title' => __( 'Showcase Flex', 'showcase-flex' ),
		'icon'  => 'star-filled',
	] );
	return $categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\\block_categories' );
