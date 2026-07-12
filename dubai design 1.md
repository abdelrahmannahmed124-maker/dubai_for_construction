---
name: Apex Engineering Identity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#ddc1ae'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a48c7a'
  outline-variant: '#564334'
  surface-tint: '#ffb77d'
  primary: '#ffb77d'
  on-primary: '#4d2600'
  primary-container: '#ff8c00'
  on-primary-container: '#623200'
  inverse-primary: '#904d00'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#aba9a9'
  on-tertiary-container: '#3f3e3e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  container-max: 1440px
---

## Brand & Style

This design system is engineered for a premium general contracting and supplies firm, blending the structural rigidity of civil engineering with the fluid sophistication of modern technology. The brand personality is rooted in **Engineering Excellence**—it is professional, authoritative, and innovative.

The visual style utilizes a **Modern Glassmorphic** approach set against a deep, architectural dark mode. This creates a high-end, gallery-like atmosphere that allows construction photography to emerge as the hero. Surfaces are treated with subtle translucency and precision-etched borders, reflecting the "transparency" and "integrity" of the firm’s operations. The interface must feel both heavy and grounded (through dark values) and technologically advanced (through vibrant accents and glass effects).

## Colors

The palette is intentionally restrained to emphasize premium quality and focus.

- **Primary (Safety Orange):** Used exclusively for calls to action, progress indicators, and critical engineering highlights. It signifies energy and the "active" nature of construction.
- **Backgrounds:** A tiered dark system starting from `#050505` for the base layer to create an infinite depth effect.
- **Glass Surfaces:** Semi-transparent layers (`surface_glass`) use white at low opacity to create the frosted effect without mudding the dark background.
- **Typography Colors:** Pure white is reserved for headings. Secondary text uses a 70% opacity white to maintain hierarchy and reduce eye strain in dark mode.

## Typography

The system uses a triple-font approach to balance aesthetics and utility.

1.  **Manrope (Headlines):** A modern, geometric sans-serif that conveys technical precision and friendliness. Used for large display titles and section headings.
2.  **Inter (Body):** Selected for its exceptional legibility in dark mode and high x-height. This handles all long-form content and UI labels.
3.  **JetBrains Mono (Technical Labels):** Used for project specs, dimensions, and technical metadata to evoke a "blueprint" or "engineering data" feel.

**Bilingual Support:** For Arabic (RTL), ensure line heights are increased by 15% to accommodate script descenders. The font weight should be slightly reduced (e.g., 600 becomes 500) to maintain visual optical weight parity with English.

## Layout & Spacing

The layout utilizes a **Fluid Grid** model with generous safe areas to mimic the vastness of large-scale construction projects.

- **RTL/LTR Adaptability:** All spacing tokens are logical (e.g., `padding-inline-start` instead of `padding-left`). In Arabic mode, the 12-column grid flips horizontally.
- **Rhythm:** An 8px base unit drives all dimensions. 
- **Desktop:** 12-column grid, 80px side margins, 24px gutters.
- **Mobile:** 4-column grid, 20px side margins, 16px gutters.
- **Photography Layout:** Hero images should use an "Edge-to-Edge" bleed on mobile, while remaining contained within a `1.5rem` rounded container on desktop to maintain the glassmorphic aesthetic.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** rather than traditional drop shadows.

- **Level 1 (Base):** The `#050505` background.
- **Level 2 (Cards):** 20px Backdrop blur with a `1px` solid border (`border_glass`). This creates the "glass" look.
- **Level 3 (Modals/Popovers):** 40px Backdrop blur with a subtle `primary_color` outer glow (5% opacity) to signify focus.
- **Shadows:** Use only "Ambient Shadows"—large, extremely soft (40px-60px blur), low-opacity (15%) black shadows to lift glass cards off the background without creating harsh edges.

## Shapes

The shape language is **Rounded**, softening the industrial nature of the brand to appear modern and approachable.

- **Standard Elements:** Buttons and input fields use `0.5rem` (8px).
- **Cards & Containers:** Large containers use `rounded-xl` (1.5rem / 24px) to create a distinct frame for project photography.
- **Micro-elements:** Tags and chips use a "Pill" shape for maximum contrast against the rigid grid.

## Components

- **Glass Cards:** The signature component. Must include a `1px` top-left highlight border to simulate light hitting glass. Content inside must have a minimum `24px` internal padding.
- **Primary Buttons:** Solid `#FF8C00` with white text. On hover, use a slight scale-up (1.02x) and an increased outer glow. No rounded corners should be fully "pill" here; keep them `rounded-md` for a more structural feel.
- **Inputs:** Dark backgrounds (`#121212`) with a bottom-only border that turns Orange on focus. Supports LTR and RTL text alignment automatically.
- **Project Counters:** Large `display-lg` numbers with `label-sm` technical labels underneath.
- **Transitions:** Use `cubic-bezier(0.2, 0.8, 0.2, 1)` for all surface entries. Photography should subtly zoom (1.05x) when cards are hovered.