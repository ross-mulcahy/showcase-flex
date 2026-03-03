<?php
/**
 * Parallax Hero — Server-side render.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner blocks content.
 * @var WP_Block $block      Block instance.
 */

$image    = esc_url( $attributes['imageUrl'] ?: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80' );
$kicker   = esc_html( $attributes['kicker'] ?? 'Investigation' );
$title    = esc_html( $attributes['title'] ?? 'The Deep Current' );
$subtitle = esc_html( $attributes['subtitle'] ?? 'How Climate Data Is Reshaping Coastal Cities' );
$byline   = esc_html( $attributes['byline'] ?? 'By Elena Vasquez &amp; Michael Torres' );
$dateline = esc_html( $attributes['dateline'] ?? 'March 3, 2026 &middot; Washington, D.C.' );
?>
<section <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-parallax-hero' ] ); ?>>
	<div class="sf-parallax-hero__media">
		<img src="<?php echo $image; ?>" alt="" loading="eager" fetchpriority="high" decoding="async" width="1920" height="1080">
	</div>
	<div class="sf-parallax-hero__overlay"></div>
	<div class="sf-parallax-hero__content">
		<?php if ( $kicker ) : ?>
			<span class="sf-parallax-hero__kicker"><?php echo $kicker; ?></span>
		<?php endif; ?>
		<h1 class="sf-parallax-hero__title"><?php echo $title; ?></h1>
		<?php if ( $subtitle ) : ?>
			<p class="sf-parallax-hero__subtitle"><?php echo $subtitle; ?></p>
		<?php endif; ?>
		<div class="sf-parallax-hero__meta">
			<?php if ( $byline ) : ?>
				<span><strong><?php echo $byline; ?></strong></span>
			<?php endif; ?>
			<?php if ( $dateline ) : ?>
				<span class="sf-dateline"><?php echo $dateline; ?></span>
			<?php endif; ?>
		</div>
	</div>
	<div class="sf-parallax-hero__scroll-hint">
		<span>Scroll to explore</span>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
	</div>
</section>
