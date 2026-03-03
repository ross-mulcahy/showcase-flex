<?php
/**
 * Before/After Slider — Server-side render.
 */
$before_img   = esc_url( $attributes['beforeImage'] ?: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80' );
$after_img    = esc_url( $attributes['afterImage'] ?: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80' );
$before_label = esc_html( $attributes['beforeLabel'] ?? '2020' );
$after_label  = esc_html( $attributes['afterLabel'] ?? '2026 (Projected)' );
?>
<div <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-before-after sf-animate sf-animate--fade-up' ] ); ?>>
	<img class="sf-before-after__image" src="<?php echo $after_img; ?>" alt="<?php echo $after_label; ?>" loading="lazy" decoding="async" width="1200" height="675">
	<div class="sf-before-after__overlay">
		<img src="<?php echo $before_img; ?>" alt="<?php echo $before_label; ?>" loading="lazy" decoding="async" width="1200" height="675">
	</div>
	<div class="sf-before-after__handle"></div>
	<span class="sf-before-after__label sf-before-after__label--before"><?php echo $before_label; ?></span>
	<span class="sf-before-after__label sf-before-after__label--after"><?php echo $after_label; ?></span>
</div>
