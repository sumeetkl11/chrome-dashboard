# Agent Execution Rules & Workspace Directives

This document contains instructions, behavioral boundaries, and coding directives for AI coding agents operating within this workspace.

---

## 1. Core Principles & Philosophy
- **"Break the Default"**: Never generate plain white backgrounds, unstyled browser inputs, or default primary colors (pure red/blue/green). Always implement dark mode, glassmorphism, dynamic glow effects, and modern Google Fonts.
- **Ponytail / Minimal Bloat Rule**: Prefer standard library and native browser features before pulling external dependencies. Keep diffs concise and root-cause focused.
- **Strict Verification**: Never declare a feature or bug fix completed without running build/runtime verification commands or browser checks.

---

## 2. Technical Stack & Implementation Guidelines
- **Frontend Stack**: Semantic HTML5, Vanilla CSS3 (Custom Properties & Glassmorphism), Modern JavaScript (ES6+), and GSAP + ScrollTrigger for animations.
- **Performance Constraints**:
  - CSS animations must target GPU properties (`transform`, `opacity`).
  - Mobile layouts must include sticky bottom action controls within single-thumb reachability.
  - HTML elements must have unique, descriptive IDs for accessibility and automated testing.

---

## 3. Workflow Checklist for Future Agent Tasks
1. **Inspect Workspace Context**: Always read [SKILL.md](file:///d:/MyWork/try/SKILL.md) and [design.md](file:///d:/MyWork/try/design.md) prior to making architectural or styling changes.
2. **Implementation Plan**: For non-trivial modifications, create or update `implementation_plan.md` in the brain artifacts directory.
3. **Execution**: Write clean, modular code with comments identifying key architectural choices (`// ponytail: ...`).
4. **Verification**: Verify execution using terminal commands or browser testing.
5. **Walkthrough**: Record results and changes in `walkthrough.md`.
