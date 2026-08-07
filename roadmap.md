Phase 1: Wireframing (Getting the Structure)
Don't jump into colors yet. Get the skeleton ready.

Setup: Open Bannani (bannani.com) or UX Pilot (free tiers).

Apply: Use this prompt in the tool: "Create a clean UI wireframe for a [Your Business/App Name]. Include a Hero Section with a CTA, a Features section, and a Footer." Take a screenshot of the output.

Phase 2: Steal Like an Artist (Moodboard)
Find a website that has the "vibe" you want and extract its DNA.

Setup: Install ColorZilla (for colors) and WhatFont (for typography) Chrome extensions. Sign up for Firecrawl (free tier).

Apply: Go to a site you like (e.g., from Dribbble or Awwwards). Use Firecrawl to scrape the site's branding, or use ColorZilla to copy the exact Hex Codes and WhatFont to get their Google Fonts (like Poppins, Inter, or Outfit).

Phase 3: The design.md System (The Secret Weapon)
AI messes up colors and buttons because it forgets the theme. A design system fixes this.

Setup: Open Google Antigravity. Create a new file named design.md in your root folder.

Apply: Paste the DNA you extracted into design.md. 

Example:
Markdown
# Design System
- **Primary Font:** 'Poppins', sans-serif (Weights: 400, 600, 800)
- **Primary Color:** #FF5733 (Orange)
- **Background:** #0A0A0A (Dark Mode)
- **Buttons:** Fully rounded (rounded-full), with a subtle glow shadow.
- **CSS Root Variables:** Enforce all colors as CSS root variables in `global.css`.
Phase 4: AI UI Generation
Time to actually build it using your vibe stack.

Setup: In Google Antigravity, set up your standard stack (e.g., Next.js, Tailwind CSS). Open the Antigravity AI chat.

Apply: Upload the wireframe screenshot from Phase 1. Prompt Antigravity:
"Build this wireframe using Next.js and Tailwind CSS. @design.md - strictly follow the design system in this file. Make sure to use CSS Root Variables for all colors so I can theme it later. Make the buttons reusable components."

Phase 5: The Refinement Loop (Killing the "AI Slop")
AI usually generates UI that looks slightly "off" (bad padding, wrong margins).

Setup: Install Puppeteer (npm i puppeteer) or just use Antigravity's built-in preview/live server.

Apply: If a section looks bad, take a screenshot of your local host and feed it back to Antigravity with this prompt:
"The padding inside the cards is too tight, and the buttons look misaligned. Increase the inner padding (p-6) and add a gap (gap-4) between the elements. Iterate until it matches premium UI standards."

Pro-Tip apni taraf se: Vibe coding is all about iteration. Never ask the AI to build the whole website at once. Build the Hero section first -> refine it -> build the Features section -> refine it. Keep your design.md updated if you change your mind about a color!