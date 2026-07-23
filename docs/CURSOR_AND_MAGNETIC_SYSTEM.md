# Cursor and Magnetic System

## Cursor architecture

`components/motion/CoconutCursor.tsx` is mounted once inside `MotionProvider`, outside transformed route content. It uses one passive pointer listener, DOM refs and one scheduled animation-frame loop. Pointer movement is lerped at 0.24 and rotation is clamped to seven degrees. React state is not updated per frame.

The cursor asset is a locally resized, true-alpha derivative of the repository's approved tender-coconut artwork: `/public/assets/motion/coconut-cursor.png`. A generated checkerboard candidate was rejected and never added to the repository.

## States and click timeline

- Rest: intact coconut.
- Target: restrained scale and shadow.
- Press: two clipped halves separate while a water ring expands.
- Release: spring-like CSS easing restores the intact fruit.

The effect never delays or replaces navigation. `MotionProvider` still preserves plain internal navigation, and modified, download, target-blank and external links bypass the route transition contract.

## Device and native-cursor rules

The custom cursor requires a fine mouse pointer, hover support and full motion quality. It is disabled for reduced/minimal motion and coarse pointers. Inputs, textareas, selects and any `[data-native-cursor]` subtree retain the native cursor. The sliding puzzle is explicitly native-cursor scoped.

## Magnetic primitive

`components/motion/Magnetic.tsx` converts pointer position into normalized -1..1 coordinates, clamps the response to a radius and maps it to bounded translation and sub-degree depth rotation. Spring values return to zero on exit. It is disabled for touch and non-full motion.

Current use is deliberately narrow: Smooothy previous/next buttons receive a 4px response. The magnetic wrapper does not own slider-track transforms and therefore cannot interfere with dragging.

## Accessibility and performance

Neither effect carries essential information. Keyboard focus, labels and native click behavior remain authoritative. There is one pointer listener, no continuous React render loop, and no new image request on mobile/reduced paths.
