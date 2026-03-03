# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Showcase Flex is a WordPress Block Theme (Full-Site Editing) built by WordPress VIP. It demonstrates high-performance, interactive editorial experiences for enterprise news publishers. Requires WordPress 6.4+ and PHP 8.1+.

## Development Setup

No build tools, package managers, or compilation steps. Place the theme in `wp-content/themes/showcase-flex/` and activate it in WordPress Admin. All CSS and JavaScript are static assets — edits take effect immediately on reload.

## Architecture

### Block Theme Structure

- **`theme.json`** — Design tokens (colors, typography, spacing, shadows, radii, transitions), layout widths (720px content / 1200px wide), and block-level style overrides. This is the single source of truth for the design system.
- **`functions.php`** — Namespaced under `ShowcaseFlex`. Auto-discovers blocks from `/blocks/*/block.json` via `register_block_type()`. Enqueues `theme.css` and `theme.js` (deferred, footer).
- **`style.css`** — Theme metadata header only (no styles).

### Custom Blocks (`/blocks/`)

Each block follows the same pattern: `block.json` (metadata, API v3) + `render.php` (server-side HTML output). No editor-side JavaScript — blocks rely on server rendering with front-end JS enhancement.

10 blocks: `parallax-hero`, `progress-bar`, `scroll-nav`, `animated-counter`, `image-reveal`, `before-after-slider`, `video-background`, `horizontal-scroll`, `pull-quote-animated`, `dark-mode-toggle`. All registered under the `showcase-flex` block category.

### Front-End Assets

- **`assets/css/theme.css`** — All theme styles. CSS custom properties use `--sf-*` prefix. Dark mode via `[data-theme="dark"]` selector with smooth transitions. Animations restricted to `transform` and `opacity` for GPU compositing.
- **`assets/js/theme.js`** — Vanilla JS (zero dependencies). IIFE module pattern with a single `init()` entry on DOMContentLoaded. Uses IntersectionObserver for scroll triggers, requestAnimationFrame for animations, and throttle/debounce utilities. Respects `prefers-reduced-motion`.

### Templates & Patterns

- **`templates/`** — `index.html` (blog listing), `single.html` (posts), `single-showcase.html` (interactive article template).
- **`parts/`** — `header.html`, `footer.html`.
- **`patterns/demo-article.php`** — Full demo article using all 10 custom blocks.

## Key Conventions

- **No external JS dependencies.** All interactivity is vanilla JavaScript — keep it that way.
- **PHP namespace:** `ShowcaseFlex` with `declare(strict_types=1)`.
- **CSS variable prefix:** `--sf-*` for theme-specific custom properties.
- **Block naming:** `showcase-flex/<block-name>` matching the directory name in `/blocks/`.
- **Performance:** Deferred script loading, passive event listeners, IntersectionObserver over scroll events, `will-change` hints, lazy video playback.
- **Dark mode:** Toggle persists via `localStorage`. System preference detected on first visit. Styles applied via `[data-theme="dark"]` attribute on `<html>`.
- **Fonts:** Playfair Display (headings), Inter (body), JetBrains Mono (code) — loaded from Google Fonts with `font-display: swap` and preconnect hints.
