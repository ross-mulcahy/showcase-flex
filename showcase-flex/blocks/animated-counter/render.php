<?php
/**
 * Animated Counter Section — Server-side render.
 */
$counters = $attributes['counters'] ?? [];
?>
<section <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-counter-section sf-section' ] ); ?>>
	<div class="sf-counter-grid sf-stagger">
		<?php foreach ( $counters as $i => $counter ) : ?>
			<div class="sf-counter-card sf-animate sf-animate--fade-up">
				<div class="sf-counter__number"
					 data-sf-counter="<?php echo esc_attr( $counter['value'] ); ?>"
					 data-sf-suffix="<?php echo esc_attr( $counter['suffix'] ?? '' ); ?>"
					 data-sf-duration="2000">
					0<?php echo esc_html( $counter['suffix'] ?? '' ); ?>
				</div>
				<div class="sf-counter__label"><?php echo esc_html( $counter['label'] ?? '' ); ?></div>
			</div>
		<?php endforeach; ?>
	</div>
</section>
