---
name: project-design-system
description: Comprehensive design system guidelines, Shadcn component integration rules, GSAP animation standards, interactive canvas physics, and Mobile UI native patterns.
---

# Design & Component Execution Guidelines

## 1. Aesthetic Directives ("Break the Default")
- **Color Tokens**: Sleek dark background (`#0A0B10` / `#0D0E15`) paired with glowing HSL accents:
  - Electric Violet (`#7C3AED`)
  - Cyan (`#06B6D4`)
  - Neon Magenta (`#EC4899`)
- **Typography**: Plus Jakarta Sans or Outfit for display headings, Inter for body text.
- **Glassmorphism**: Use backdrop filters (`backdrop-filter: blur(16px)`), subtle translucent borders (`rgba(255, 255, 255, 0.08)`), and ambient mesh glow backgrounds.
- Avoid generic AI defaults (solid plain white backgrounds or plain primary blues/reds).

## 2. Shadcn Integration Rules
- Use clean, modular component structures with full access to props.
- Maintain consistent spacing tokens (`var(--spacing-*)`) and layout primitives.
- Ensure all interactive elements include micro-animations and glowing hover/focus states.

## 3. GSAP & Canvas Animation Rules
- **GPU Acceleration**: Always animate GPU-accelerated CSS properties: `transform` (`translate3d`, `x`, `y`, `scale`, `rotateX/Y`) and `opacity`.
- **Layout Thrashing**: Avoid animating `top`, `left`, `width`, or `height` directly.
- **ScrollTrigger Sync**: Bind scroll progress, sticky navbar blurs, and section reveals with `ScrollTrigger`.
- **Interactive Micro-Interactions**:
  - 3D parallax card tilt (`rotateX/rotateY`) with smooth reset.
  - Lerp-driven custom glowing cursor follower.
  - Magnetic spring physics on primary buttons (`.magnetic-btn`).
  - Ambient particle canvas renderer with distance-based connecting lines.

## 4. Single-Page Architecture Standards
1. **Sticky Glassmorphic Navbar**: Logo, section jump links with active scroll spy, and primary CTA.
2. **Hero Section**: High-impact headline, animated gradient text, ambient particle canvas background, and interactive 3D card preview.
3. **Feature Showcase Section**: Dynamic 3D interactive cards with hover tilt/glow effects.
4. **Animated Stats/Metrics**: Count-up numbers triggered on scroll into view.
5. **Interactive Workflow Steps**: Step-by-step installation/integration showcase.
6. **Testimonials Marquee**: Infinite smooth auto-scrolling testimonial slider.
7. **Glassmorphic Call-to-Action**: High-converting newsletter/trial input form.

## 5. Mobile App UI & Native Constraints
- **Thumb Zone**: Primary action buttons (CTAs, navigation toggles) must sit within the lower 1/3 of screen bounds for single-thumb reachability (`.mobile-thumb-bar`).
- Touch targets must be at least 48px x 48px.
- Limit font scale on mobile screens to maximum 3 semantic hierarchy levels (Title, Body, Caption).
- Incorporate Material 3 surface elevation/tinting or iOS glassmorphic blur layers depending on target target framework.
