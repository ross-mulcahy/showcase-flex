/**
 * Showcase Flex — Interaction Engine
 *
 * Vanilla JS only. No frameworks, no heavy deps.
 * All animations use transform/opacity for compositor-thread performance.
 * Intersection Observer for scroll triggers. requestAnimationFrame for smooth updates.
 *
 * @package ShowcaseFlex
 * @since   1.0.0
 */

( function () {
	'use strict';

	/* -------------------------------------------------------
	   Utility: throttle & debounce
	   ------------------------------------------------------- */
	function throttle( fn, wait ) {
		let last = 0;
		return function ( ...args ) {
			const now = performance.now();
			if ( now - last >= wait ) {
				last = now;
				fn.apply( this, args );
			}
		};
	}

	function debounce( fn, wait ) {
		let id;
		return function ( ...args ) {
			clearTimeout( id );
			id = setTimeout( () => fn.apply( this, args ), wait );
		};
	}

	/* Detect reduced motion preference */
	const prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* -------------------------------------------------------
	   1. Reading Progress Bar
	   ------------------------------------------------------- */
	function initProgressBar() {
		const fill = document.querySelector( '.sf-progress-bar__fill' );
		if ( ! fill ) return;

		const update = () => {
			const scrollTop    = window.scrollY;
			const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
			const progress     = docHeight > 0 ? Math.min( scrollTop / docHeight, 1 ) : 0;
			fill.style.width   = ( progress * 100 ).toFixed( 2 ) + '%';
			document.documentElement.style.setProperty( '--sf-progress', progress.toFixed( 3 ) );
		};

		window.addEventListener( 'scroll', throttle( update, 16 ), { passive: true } );
		update();
	}

	/* -------------------------------------------------------
	   2. Parallax Hero
	   ------------------------------------------------------- */
	function initParallaxHero() {
		if ( prefersReducedMotion ) return;

		const hero    = document.querySelector( '.sf-parallax-hero' );
		if ( ! hero ) return;

		const media   = hero.querySelector( '.sf-parallax-hero__media' );
		const content = hero.querySelector( '.sf-parallax-hero__content' );

		let ticking = false;

		function onScroll() {
			if ( ticking ) return;
			ticking = true;

			requestAnimationFrame( () => {
				const scrollY = window.scrollY;
				const heroH   = hero.offsetHeight;

				if ( scrollY < heroH * 1.2 ) {
					// Media moves slower than scroll (parallax down)
					const mediaShift   = scrollY * 0.35;
					media.style.transform  = 'translate3d(0,' + mediaShift + 'px,0) scale(' + ( 1 + scrollY * 0.0001 ) + ')';

					// Content moves faster (parallax up)
					const contentShift = scrollY * 0.5;
					const opacity      = 1 - scrollY / ( heroH * 0.7 );
					content.style.transform = 'translate3d(0,' + contentShift + 'px,0)';
					content.style.opacity   = Math.max( opacity, 0 ).toFixed( 3 );
				}

				ticking = false;
			} );
		}

		window.addEventListener( 'scroll', onScroll, { passive: true } );
	}

	/* -------------------------------------------------------
	   3. Scroll-Triggered Animations (Intersection Observer)
	   ------------------------------------------------------- */
	function initScrollAnimations() {
		const elements = document.querySelectorAll( '.sf-animate' );
		if ( ! elements.length ) return;

		if ( prefersReducedMotion ) {
			elements.forEach( el => el.classList.add( 'is-visible' ) );
			return;
		}

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( entry => {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-visible' );
						observer.unobserve( entry.target ); // animate once
					}
				} );
			},
			{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
		);

		elements.forEach( el => observer.observe( el ) );
	}

	/* -------------------------------------------------------
	   4. Animated Counters
	   ------------------------------------------------------- */
	function initCounters() {
		const counters = document.querySelectorAll( '[data-sf-counter]' );
		if ( ! counters.length ) return;

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( entry => {
					if ( entry.isIntersecting ) {
						animateCounter( entry.target );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.3 }
		);

		counters.forEach( el => observer.observe( el ) );
	}

	function animateCounter( el ) {
		const target   = parseInt( el.getAttribute( 'data-sf-counter' ), 10 );
		const duration = parseInt( el.getAttribute( 'data-sf-duration' ) || '2000', 10 );
		const suffix   = el.getAttribute( 'data-sf-suffix' ) || '';
		const start    = performance.now();

		function tick( now ) {
			const elapsed  = now - start;
			const progress = Math.min( elapsed / duration, 1 );
			// Ease-out cubic
			const eased    = 1 - Math.pow( 1 - progress, 3 );
			const current  = Math.round( eased * target );

			el.textContent = current.toLocaleString() + suffix;

			if ( progress < 1 ) {
				requestAnimationFrame( tick );
			}
		}

		requestAnimationFrame( tick );
	}

	/* -------------------------------------------------------
	   5. Horizontal Scroll Storytelling
	   ------------------------------------------------------- */
	function initHorizontalScroll() {
		const section = document.querySelector( '.sf-horizontal-scroll' );
		if ( ! section ) return;

		// On mobile, degrade to native horizontal scroll
		if ( window.innerWidth < 769 ) return;

		const sticky = section.querySelector( '.sf-horizontal-scroll__sticky' );
		const track  = section.querySelector( '.sf-horizontal-scroll__track' );
		const cards  = section.querySelectorAll( '.sf-horizontal-scroll__card' );
		const dots   = section.querySelectorAll( '.sf-horizontal-scroll__dot' );

		if ( ! track || ! cards.length ) return;

		let ticking = false;

		function onScroll() {
			if ( ticking ) return;
			ticking = true;

			requestAnimationFrame( () => {
				const rect     = section.getBoundingClientRect();
				const sectionH = section.offsetHeight;
				const viewH    = window.innerHeight;

				// How far through the section are we? 0 → 1
				const scrolled  = -rect.top;
				const totalMove = sectionH - viewH;
				const progress  = Math.max( 0, Math.min( scrolled / totalMove, 1 ) );

				// Total track width minus viewport
				const trackW   = track.scrollWidth - sticky.offsetWidth;
				const offset   = progress * trackW;

				track.style.transform = 'translate3d(' + ( -offset ) + 'px, 0, 0)';

				// Update dot indicators
				if ( dots.length ) {
					const activeIndex = Math.min(
						Math.floor( progress * cards.length ),
						cards.length - 1
					);
					dots.forEach( ( dot, i ) => {
						dot.classList.toggle( 'is-active', i === activeIndex );
					} );
				}

				ticking = false;
			} );
		}

		window.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();
	}

	/* -------------------------------------------------------
	   6. Image Reveal
	   ------------------------------------------------------- */
	function initImageReveal() {
		const reveals = document.querySelectorAll( '.sf-image-reveal' );
		if ( ! reveals.length ) return;

		if ( prefersReducedMotion ) {
			reveals.forEach( el => el.classList.add( 'is-revealed' ) );
			return;
		}

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( entry => {
					if ( entry.isIntersecting ) {
						entry.target.classList.add( 'is-revealed' );
						observer.unobserve( entry.target );
					}
				} );
			},
			{ threshold: 0.2 }
		);

		reveals.forEach( el => observer.observe( el ) );
	}

	/* -------------------------------------------------------
	   7. Before/After Slider
	   ------------------------------------------------------- */
	function initBeforeAfter() {
		document.querySelectorAll( '.sf-before-after' ).forEach( initSlider );
	}

	function initSlider( container ) {
		const overlay = container.querySelector( '.sf-before-after__overlay' );
		const handle  = container.querySelector( '.sf-before-after__handle' );
		if ( ! overlay || ! handle ) return;

		let isDragging = false;

		function getPosition( e ) {
			const rect = container.getBoundingClientRect();
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			return Math.max( 0, Math.min( ( clientX - rect.left ) / rect.width, 1 ) );
		}

		function updatePosition( ratio ) {
			const pct = ( ratio * 100 ).toFixed( 2 ) + '%';
			overlay.style.width = pct;
			handle.style.left   = pct;
		}

		function onStart( e ) {
			isDragging = true;
			updatePosition( getPosition( e ) );
			e.preventDefault();
		}

		function onMove( e ) {
			if ( ! isDragging ) return;
			updatePosition( getPosition( e ) );
		}

		function onEnd() {
			isDragging = false;
		}

		container.addEventListener( 'mousedown',  onStart );
		container.addEventListener( 'touchstart', onStart, { passive: false } );
		window.addEventListener( 'mousemove',  onMove );
		window.addEventListener( 'touchmove',  onMove, { passive: true } );
		window.addEventListener( 'mouseup',    onEnd );
		window.addEventListener( 'touchend',   onEnd );
	}

	/* -------------------------------------------------------
	   8. Dark / Light Mode Toggle
	   ------------------------------------------------------- */
	function initThemeToggle() {
		const toggles = document.querySelectorAll( '.sf-theme-toggle' );
		if ( ! toggles.length ) return;

		// Restore saved preference
		const saved = localStorage.getItem( 'sf-theme' );
		if ( saved ) {
			document.documentElement.setAttribute( 'data-theme', saved );
		} else if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) {
			document.documentElement.setAttribute( 'data-theme', 'dark' );
		}

		toggles.forEach( btn => {
			btn.addEventListener( 'click', () => {
				const current = document.documentElement.getAttribute( 'data-theme' );
				const next    = current === 'dark' ? 'light' : 'dark';
				document.documentElement.setAttribute( 'data-theme', next );
				localStorage.setItem( 'sf-theme', next );
			} );
		} );
	}

	/* -------------------------------------------------------
	   9. Sticky Navigation with Active Section Tracking
	   ------------------------------------------------------- */
	function initStickyNav() {
		const nav      = document.querySelector( '.sf-sticky-nav' );
		const hero     = document.querySelector( '.sf-parallax-hero' );
		const links    = document.querySelectorAll( '.sf-sticky-nav__link' );
		const sections = [];

		if ( ! nav ) return;

		// Build section list from nav links
		links.forEach( link => {
			const id = link.getAttribute( 'href' );
			if ( id && id.startsWith( '#' ) ) {
				const el = document.querySelector( id );
				if ( el ) sections.push( { el, link } );
			}
		} );

		// Show/hide nav based on scroll position
		const heroH = hero ? hero.offsetHeight : 400;

		function updateNav() {
			const scrollY = window.scrollY;

			// Show nav after scrolling past hero
			nav.classList.toggle( 'is-visible', scrollY > heroH * 0.6 );

			// Highlight active section
			let activeIndex = 0;
			for ( let i = sections.length - 1; i >= 0; i-- ) {
				if ( sections[ i ].el.getBoundingClientRect().top < window.innerHeight * 0.4 ) {
					activeIndex = i;
					break;
				}
			}

			links.forEach( l => l.classList.remove( 'is-active' ) );
			if ( sections[ activeIndex ] ) {
				sections[ activeIndex ].link.classList.add( 'is-active' );
			}
		}

		window.addEventListener( 'scroll', throttle( updateNav, 100 ), { passive: true } );
		updateNav();

		// Smooth scroll on link click
		links.forEach( link => {
			link.addEventListener( 'click', ( e ) => {
				const href = link.getAttribute( 'href' );
				if ( href && href.startsWith( '#' ) ) {
					e.preventDefault();
					const target = document.querySelector( href );
					if ( target ) {
						const offset = nav.offsetHeight + 20;
						const top    = target.getBoundingClientRect().top + window.scrollY - offset;
						window.scrollTo( { top, behavior: 'smooth' } );
					}
				}
			} );
		} );
	}

	/* -------------------------------------------------------
	   10. Lazy-load videos (play only when visible)
	   ------------------------------------------------------- */
	function initLazyVideos() {
		const videos = document.querySelectorAll( 'video[data-sf-lazy]' );
		if ( ! videos.length ) return;

		const observer = new IntersectionObserver(
			( entries ) => {
				entries.forEach( entry => {
					const video = entry.target;
					if ( entry.isIntersecting ) {
						if ( video.paused ) video.play().catch( () => {} );
					} else {
						if ( ! video.paused ) video.pause();
					}
				} );
			},
			{ threshold: 0.25 }
		);

		videos.forEach( v => observer.observe( v ) );
	}

	/* -------------------------------------------------------
	   11. Stagger animation indices
	   ------------------------------------------------------- */
	function initStagger() {
		document.querySelectorAll( '.sf-stagger' ).forEach( parent => {
			Array.from( parent.children ).forEach( ( child, i ) => {
				child.style.setProperty( '--sf-stagger-index', i );
			} );
		} );
	}

	/* -------------------------------------------------------
	   Boot
	   ------------------------------------------------------- */
	function init() {
		initThemeToggle();
		initProgressBar();
		initParallaxHero();
		initScrollAnimations();
		initCounters();
		initHorizontalScroll();
		initImageReveal();
		initBeforeAfter();
		initStickyNav();
		initLazyVideos();
		initStagger();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

	// Re-init horizontal scroll on resize (debounced)
	window.addEventListener( 'resize', debounce( () => {
		initHorizontalScroll();
	}, 250 ) );

} )();
