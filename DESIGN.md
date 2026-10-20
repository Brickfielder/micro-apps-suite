---
version: alpha
colors:
  page: '#f5f7f8'
  surface: '#ffffff'
  text: '#172026'
  muted: '#61717a'
  accent: '#167c8c'
  danger: '#b42318'
typography:
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
  phone:
    fontFamily: 'system-ui, -apple-system, sans-serif'
rounded:
  control: '8px'
omitted:
  - section: spacing
    reason: 'Existing shared theme and app-specific layout remain the runtime owners.'
  - section: components
    reason: 'Components consume the existing shared theme directly.'
---

# Micro Apps Suite design

## Overview
An approachable functional-practice tool, following the existing suite. The emergency simulator's distinctive object is the familiar phone itself: a convincing iPhone or Pixel-like launcher, keypad and call surface, surrounded by a quiet rehabilitation workspace. No emergency-service branding or flashing urgency. Product familiarity takes priority over marketing expression.

## Colors
`shared/theme.css` is canonical for the suite tokens above (`--page`, `--surface`, `--text`, `--muted`, `--accent`, `--bad`). This document mirrors them; it does not generate CSS. The phone-specific palette is owned by `apps/emergency-call-simulator/app.css` and never changes the suite theme. Red is reserved for stopping; teal for beginning practice. The training indicator remains visible outside the phone.

## Typography
Use the suite's existing system-font stack, with system phone typography inside the device. Body and configuration text are at least 16px; patient actions at least 44px high. Durations use tabular numerals. No external fonts.

## Layout
Scenario and orientation on the left, a centred phone on the right. On narrow screens they stack in reading order. Clinical settings sit in an explicit disclosure; feedback follows the exercise. Only the phone has a fixed aspect. Document scrolling owns all other content. Maintain usable reflow at 320px.

## Elevation & Depth
One pronounced shadow belongs to the physical phone. Surrounding panels use the existing border tokens and modest radii. No decorative dashboards or invented clinical scores.

## Shapes
Suite controls retain 8px corners. The phone intentionally uses larger corners, circular call controls, iPhone rounded-square icons and Android circular icons.

## Components
Native labelled selects and checkboxes own platform popup geometry and keyboard operation. Buttons use the shared `.button` baseline. A native `details` disclosure owns clinician configuration. Feedback is editable through native form controls. Icons are local inline SVG. See `UX-CONTRACT.md` for behaviour.

## Do's and Don'ts
Keep the stop action and microphone state readable. Respect reduced motion. Ask one focused question at a time. Do not hide safety status for immersion, penalise slow speech, label provisional observations as validated outcomes, or imply real dispatch.
