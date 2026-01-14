# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static site for "The Future Is Solo" (TFIS), a research initiative exploring how AI and automation empower individuals to build billion-dollar businesses without traditional teams. The site uses the Ananke theme with extensive custom styling and layout overrides.

## Development Commands

### Local Development
```bash
# Start development server with drafts and live reload
hugo server --buildDrafts --bind 0.0.0.0 --port 1313

# Start development server without fast render (for thorough testing)
hugo server --buildDrafts --bind 0.0.0.0 --port 1313 --disableFastRender

# Build static site for production
hugo --minify
```

### Content Management
```bash
# Create new blog post
hugo new blog/post-title.md

# Create new page
hugo new page-name.md
```

## Architecture

### Content Structure
- **Homepage**: Uses custom `layouts/index.html` with hero section featuring animated CSS gradient
- **Content Pages**: Standard markdown files in `/content/` (about, research, case-studies, contact)
- **Blog**: Structured content in `/content/blog/` with list template override
- **Navigation**: Managed via `hugo.toml` menu configuration

### Layout System
- **Base Template**: `layouts/_default/baseof.html` - includes Google Fonts (Noto Sans) preload
- **Homepage**: `layouts/index.html` - custom hero section with gradient animation
- **List Pages**: `layouts/_default/list.html` - consistent blog/archive formatting
- **Header/Footer**: `layouts/partials/site-header.html` and `layouts/partials/site-footer.html`

### Styling Architecture
- **Primary CSS**: `/static/css/custom.css` (800+ lines)
- **Typography**: Noto Sans from Google Fonts as primary typeface
- **Design System**: CSS custom properties for colors, spacing, and responsive breakpoints
- **Hero Section**: Animated gradient background with 15-second animation cycle
- **Responsive**: Mobile-first approach with desktop-specific overrides

### Key Design Features
- **Logo Integration**: Custom TFIS logo in header with responsive sizing (48px desktop, 38px mobile)
- **Gradient Hero**: Stripe/Scale API-inspired animated gradient background
- **Glass Morphism**: Subtle backdrop-filter effects on key UI elements  
- **Typography Hierarchy**: Balanced heading scales for desktop and mobile
- **Navigation**: Responsive menu with mobile hamburger toggle

### Content Synchronization
The site is designed to auto-update when markdown files are edited. Hugo's development server provides live reload functionality during development.

### Theme Override Strategy
This site extensively overrides the Ananke theme:
- Custom layouts replace theme defaults
- Complete CSS override via `/static/css/custom.css`
- Custom partials for header/footer
- Theme configuration preserved in `hugo.toml`

### Image Assets
- **Logo**: `/static/images/tfis_logo.png` - responsive sizing handled via CSS
- **Favicon**: Not currently configured (favicon parameter empty in hugo.toml)

## Important Files

- `hugo.toml` - Site configuration, menu structure, theme settings
- `layouts/index.html` - Homepage template with hero section
- `layouts/_default/baseof.html` - Base HTML structure and Google Fonts loading
- `layouts/partials/site-header.html` - Navigation header with mobile menu
- `static/css/custom.css` - Complete styling system
- `content/_index.md` - Homepage content (appears below hero section)