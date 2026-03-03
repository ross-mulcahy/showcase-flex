<?php
/**
 * Video Background Section — Server-side render.
 */
$video   = esc_url( $attributes['videoUrl'] ?: 'https://static.videezy.com/system/resources/previews/000/044/025/original/Drone-1.mp4' );
$poster  = esc_url( $attributes['posterUrl'] ?: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=60' );
$title   = esc_html( $attributes['title'] ?? 'Where Land Meets the Rising Tide' );
$text    = esc_html( $attributes['text'] ?? 'Drone footage captured over the Outer Banks reveals the accelerating erosion that threatens miles of coastline. What once seemed like gradual change is now visible year over year.' );
?>
<section <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-video-section' ] ); ?>>
	<div class="sf-video-section__media">
		<video autoplay muted loop playsinline preload="none" poster="<?php echo $poster; ?>" data-sf-lazy>
			<source src="<?php echo $video; ?>" type="video/mp4">
		</video>
	</div>
	<div class="sf-video-section__overlay"></div>
	<div class="sf-video-section__content sf-animate sf-animate--fade-up">
		<h2 class="sf-video-section__title"><?php echo $title; ?></h2>
		<p class="sf-video-section__text"><?php echo $text; ?></p>
	</div>
</section>
