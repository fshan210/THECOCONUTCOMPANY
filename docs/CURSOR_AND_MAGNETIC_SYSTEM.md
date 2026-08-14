# Magnetic System

## Magnetic primitive

`components/motion/Magnetic.tsx` converts pointer position into normalized -1..1 coordinates, clamps the response to a radius and maps it to bounded translation and sub-degree depth rotation. Spring values return to zero on exit. It is disabled for touch and non-full motion.

Current use is deliberately narrow: Smooothy previous/next buttons receive a 4px response. The magnetic wrapper does not own slider-track transforms and therefore cannot interfere with dragging.

## Accessibility and performance

The effect carries no essential information. Keyboard focus, labels and native click behavior remain authoritative.
