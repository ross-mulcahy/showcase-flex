<?php
/**
 * Scroll Navigation — Server-side render.
 */
$brand    = esc_html( $attributes['brand'] ?? 'The Deep Current' );
$sections = $attributes['sections'] ?? [];
?>
<nav <?php echo get_block_wrapper_attributes( [ 'class' => 'sf-sticky-nav' ] ); ?> aria-label="Article navigation">
	<div class="sf-sticky-nav__inner">
		<a class="sf-sticky-nav__brand" href="#"><?php echo $brand; ?></a>
		<?php if ( $sections ) : ?>
			<ul class="sf-sticky-nav__links">
				<?php foreach ( $sections as $sec ) : ?>
					<li><a class="sf-sticky-nav__link" href="#<?php echo esc_attr( $sec['id'] ); ?>"><?php echo esc_html( $sec['label'] ); ?></a></li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
		<!-- Dark mode toggle inline -->
		<button class="sf-theme-toggle" type="button" aria-label="Toggle dark mode">
			<svg class="sf-theme-toggle__icon sf-theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
			<svg class="sf-theme-toggle__icon sf-theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
			<span>Theme</span>
		</button>
	</div>
</nav>
