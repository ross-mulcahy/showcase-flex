<?php
/**
 * Image Reveal — Server-side render.
 */
$image   = esc_url( $attributes['imageUrl'] ?: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=1200&q=80' );
$alt     = esc_attr( $attributes['alt'] ?? 'Coastal city aerial view' );
$credit  = esc_html( $attributes['credit'] ?? '' );
$caption = esc_html( $attributes['caption'] ?? '' );
?>
<figure <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-image-reveal' ] ); ?>>
	<img src="<?php echo $image; ?>" alt="<?php echo $alt; ?>" loading="lazy" decoding="async" width="1200" height="675">
	<?php if ( $credit ) : ?>
		<span class="sf-image-reveal__credit"><?php echo $credit; ?></span>
	<?php endif; ?>
	<?php if ( $caption ) : ?>
		<figcaption style="padding:0.75rem 0; font-size:0.85rem; color:var(--sf-text-muted); text-align:center;"><?php echo $caption; ?></figcaption>
	<?php endif; ?>
</figure>
