# Smooothy Slider Implementation

## Selection

Smooothy 0.0.35 was selected for bounded, transform-based editorial rails because it supports horizontal and vertical axes, variable widths, snapping, direct dragging, `parallaxValues`, speed and delta time. The package is MIT licensed. It is intentionally not a page-scroll replacement.

## Architecture

- Core hook: `components/sliders/useSmooothySlider.ts`
- Shared renderer: `components/sliders/SmooothySlider.tsx`
- Axis wrappers: `SmooothyHorizontalSlider.tsx` and `SmooothyVerticalSlider.tsx`
- Slide semantics: `SmooothySlide.tsx`
- Controls: `SmooothyControls.tsx`

Each instance registers one stable update callback with the existing GSAP ticker. Cleanup removes the ticker callback, clears inline media transforms and destroys the instance. Visibility changes pause the instance.

## Horizontal implementation

The Journal community rail uses one logical set of posts. Smooothy handles the track translation and snapping; nested `[data-smooothy-media]` elements receive capped horizontal parallax. The DOM is not manually duplicated.

## Vertical implementation

The reusable vertical wrapper is available for genuinely vertical, bounded galleries. It is not mounted on the About Journey because that narrative is clearer in normal document flow on mobile and sticky progress on desktop.

## Input and accessibility

- Arrow keys follow the configured axis; Home and End jump to bounds.
- Controls are 44px buttons with labels and visible focus.
- A polite live region announces the logical slide number.
- A 7px movement threshold separates a drag from a click.
- Command, Control, Shift and Alt modified clicks remain untouched.
- Horizontal rails allow native vertical touch panning; vertical rails allow native horizontal panning.
- Reduced/minimal motion bypasses Smooothy and exposes native snap overflow.

## Parallax and speed

Nested media uses Smooothy `parallaxValues`. Speed is smoothed with the library's time-based `damp` helper using `deltaTime`. Translation is clamped to 14px and depth rotation below one degree. `speedDecay` is 0.91 and the track lerp factor is 0.12.

## Why it is not used elsewhere

The homepage product grid, About Journey, Shop filtering and puzzle already have stable interaction owners. Replacing those would create competing transforms or lower usability. Smooothy is limited to the Journal rail until additional editorial rails demonstrate a real need.
