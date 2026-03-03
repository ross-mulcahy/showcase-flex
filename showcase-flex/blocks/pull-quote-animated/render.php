<?php
/**
 * Animated Pull Quote — Server-side render.
 */
$quote       = esc_html( $attributes['quote'] ?? 'The ocean does not negotiate with zoning boards. It simply arrives.' );
$attribution = esc_html( $attributes['attribution'] ?? 'Dr. Maria Chen, NOAA Climate Adaptation Division' );
?>
<aside <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-pull-quote sf-animate sf-animate--scale' ] ); ?>>
	<div class="sf-pull-quote__bg" aria-hidden="true"></div>
	<div class="sf-pull-quote__shape sf-pull-quote__shape--1" aria-hidden="true"></div>
	<div class="sf-pull-quote__shape sf-pull-quote__shape--2" aria-hidden="true"></div>
	<blockquote class="sf-pull-quote__text"><?php echo $quote; ?></blockquote>
	<?php if ( $attribution ) : ?>
		<cite class="sf-pull-quote__attribution">&mdash; <?php echo $attribution; ?></cite>
	<?php endif; ?>
</aside>
