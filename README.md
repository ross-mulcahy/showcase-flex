# Showcase Flex

A high-performance, interactive WordPress block theme proving that traditional WordPress can deliver app-like editorial experiences — no decoupled architecture required. Built for enterprise news publishers evaluating WordPress VIP.

## Requirements

- WordPress 6.4+
- PHP 8.1+

## Installation

1. Clone or download this repository into your WordPress installation's `wp-content/themes/` directory.
2. Activate the theme in **Appearance > Themes**.
3. No build step, no dependencies — the theme is ready to use immediately.

## Custom Blocks

All blocks are server-side rendered with vanilla JavaScript interactions. They appear in the editor under the **Showcase Flex** block category.

| Block | Description |
|---|---|
| **Parallax Hero** | Full-bleed hero section with Ken Burns zoom, headline, subtitle, and byline |
| **Reading Progress Bar** | Thin branded bar fixed at the top of the viewport, driven by scroll position |
| **Scroll Navigation** | Sticky nav with section links, active highlighting, and dark mode toggle |
| **Animated Counter** | Grid of number counters that animate when scrolled into view |
| **Image Reveal** | Scroll-triggered image unveil with clip-path wipe and blur transition |
| **Before/After Slider** | Draggable image comparison slider with mouse and touch support |
| **Video Background** | Section with muted autoplaying background video and text overlay |
| **Horizontal Scroll** | Vertical scrolling drives a horizontal card carousel / timeline |
| **Animated Pull Quote** | Large editorial quote with gradient background animations |
| **Dark Mode Toggle** | Toggle button switching between light and dark colour palettes |

## Demo Content

The theme includes a full demo article pattern (**Showcase Flex > The Deep Current**) that demonstrates all 10 custom blocks in an interactive long-form editorial layout. The `single.html` and `single-showcase.html` templates use this pattern automatically.

## Architecture

- **No build tools.** All CSS and JavaScript are static assets — no npm, no bundler, no compilation.
- **No external JS dependencies.** Every interaction is vanilla JavaScript using IntersectionObserver, requestAnimationFrame, and passive event listeners.
- **Server-side rendered blocks.** Each block has a `block.json` + `render.php`. A shared `editor.js` registers all blocks in the editor with `ServerSideRender`.
- **Design tokens in `theme.json`.** Colours, typography (Playfair Display, Inter, JetBrains Mono), spacing, shadows, and transitions are all defined in one place.
- **Dark mode.** Toggled via `[data-theme="dark"]` on `<html>`, persisted in `localStorage`, with system preference detection on first visit.
- **Performance-first CSS.** Animations use only `transform` and `opacity` for GPU compositing. Videos lazy-load and only play when visible.

## File Structure

```
├── assets/
│   ├── css/theme.css        Main theme styles (light/dark, animations, layouts)
│   └── js/
│       ├── theme.js          Front-end interaction engine
│       └── editor.js         Block editor registrations (ServerSideRender)
├── blocks/                   10 custom blocks (block.json + render.php each)
├── templates/                Block templates (index, single, single-showcase)
├── parts/                    Header and footer template parts
├── patterns/                 Demo article pattern
├── functions.php             Theme setup, asset enqueuing, block registration
├── theme.json                Design tokens and block theme configuration
└── style.css                 Theme metadata header
```

## License

GNU General Public License v2 or later. See [LICENSE](http://www.gnu.org/licenses/gpl-2.0.html).
