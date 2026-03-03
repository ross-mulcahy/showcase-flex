<?php
/**
 * Horizontal Scroll Timeline — Server-side render.
 */
$cards = $attributes['cards'] ?? [];

// Default demo cards if none provided
if ( empty( $cards ) ) {
	$cards = [
		[
			'chapter' => 'Chapter 1',
			'title'   => 'The First Warnings',
			'excerpt' => 'In 2019, satellite data began telling a story that coastal planners couldn\'t ignore. Sea-level rise projections were being revised upward at an unprecedented rate.',
			'image'   => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=75',
		],
		[
			'chapter' => 'Chapter 2',
			'title'   => 'Data Meets Policy',
			'excerpt' => 'When NOAA released its updated coastal flood models, city councils from Miami to Mumbai were forced to reckon with infrastructure plans built on outdated assumptions.',
			'image'   => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=75',
		],
		[
			'chapter' => 'Chapter 3',
			'title'   => 'The Human Cost',
			'excerpt' => 'Behind every data point is a community. In Norfolk, Virginia, residents of the Chesterfield Heights neighborhood face chronic flooding — and declining property values.',
			'image'   => 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=75',
		],
		[
			'chapter' => 'Chapter 4',
			'title'   => 'Engineering the Future',
			'excerpt' => 'Rotterdam\'s approach to living with water has become a blueprint. From floating neighbourhoods to climate-adaptive parks, engineering is meeting ecology halfway.',
			'image'   => 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75',
		],
		[
			'chapter' => 'Chapter 5',
			'title'   => 'A New Consensus',
			'excerpt' => 'By 2025, the question was no longer whether cities would adapt, but how fast. A new generation of climate-literate urban planners is leading the charge.',
			'image'   => 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&q=75',
		],
	];
}
?>
<section <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-horizontal-scroll' ] ); ?>>
	<div class="sf-horizontal-scroll__sticky">
		<div class="sf-horizontal-scroll__track">
			<?php foreach ( $cards as $card ) : ?>
				<article class="sf-horizontal-scroll__card">
					<?php if ( ! empty( $card['image'] ) ) : ?>
						<img class="sf-horizontal-scroll__card-image" src="<?php echo esc_url( $card['image'] ); ?>" alt="" loading="lazy" decoding="async" width="420" height="220">
					<?php endif; ?>
					<div class="sf-horizontal-scroll__card-body">
						<?php if ( ! empty( $card['chapter'] ) ) : ?>
							<div class="sf-horizontal-scroll__card-chapter"><?php echo esc_html( $card['chapter'] ); ?></div>
						<?php endif; ?>
						<h3 class="sf-horizontal-scroll__card-title"><?php echo esc_html( $card['title'] ); ?></h3>
						<p class="sf-horizontal-scroll__card-excerpt"><?php echo esc_html( $card['excerpt'] ); ?></p>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
	<div class="sf-horizontal-scroll__progress">
		<?php for ( $i = 0; $i < count( $cards ); $i++ ) : ?>
			<span class="sf-horizontal-scroll__dot<?php echo $i === 0 ? ' is-active' : ''; ?>"></span>
		<?php endfor; ?>
	</div>
</section>
