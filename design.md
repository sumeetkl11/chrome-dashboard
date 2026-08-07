# Design System Specifications & Visual Style Guide

This document establishes the design principles, visual hierarchy, color palette, typography, and animation physics for the project.

---

## 1. Color System & Design Tokens

### Background Surfaces
- **Primary Canvas**: `#0A0B10` (Ultra Dark Obsidian)
- **Secondary Surface**: `rgba(18, 20, 32, 0.65)` (Translucent Dark Glass)
- **Glass Border**: `rgba(255, 255, 255, 0.08)` (Subtle White Rim)
- **Active Glass Border**: `rgba(255, 255, 255, 0.20)`

### Accent Palettes & Glowing HSL Tokens
- **Electric Violet**: `#7C3AED` (`rgba(124, 58, 237, 1.0)`) — Used for primary CTAs and brand identity.
- **Cyan Spark**: `#06B6D4` (`rgba(6, 182, 212, 1.0)`) — Used for active state indicators, telemetry metrics, and highlights.
- **Neon Magenta**: `#EC4899` (`rgba(236, 72, 153, 1.0)`) — Used for gradient text transitions and key accent badges.

### Typography
- **Display Headings**: `Plus Jakarta Sans` or `Outfit` (Weights: 600, 700, 800).
- **Body & Captions**: `Inter` (Weights: 300, 400, 500).

---

## 2. Visual Style & Component Specs

### Glassmorphism Card Spec
```css
.glass-card {
  background: rgba(18, 20, 32, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
```

### Gradient Text Pattern
```css
.gradient-text {
  background: linear-gradient(135deg, #f8fafc 20%, #06b6d4 60%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 3. Animation Standards & Motion Physics

### GSAP Performance Rules
- **GPU Properties Only**: Animate `transform` (`translate3d`, `x`, `y`, `scale`, `rotateX/Y`) and `opacity`. Never animate layout reflow properties (`top`, `left`, `width`, `height`).

### Micro-Interactions
1. **Magnetic Spring Buttons**: Hovering over `.magnetic-btn` moves the target towards the cursor by `30%` offset; leaving triggers an elastic snap-back (`ease: 'elastic.out(1, 0.3)'`).
2. **3D Card Parallax Tilt**: Calculates cursor offset relative to center of `.card-3d` element and applies `rotateX` and `rotateY` with `transformPerspective: 1000`.
3. **Cursor Glow Lerp**: Mouse coordinates update a glowing radial backdrop using linear interpolation (`lerp = 0.15`) for fluid inertia.

---

## 4. Responsive & Mobile UI Rules
- **Thumb Zone Rule**: Navigation controls, mobile toggles, and primary CTAs must remain within the bottom 1/3 of the device viewport (`.mobile-thumb-bar`).
- **Touch Target Boundaries**: Minimum click target size of 48px x 48px.
