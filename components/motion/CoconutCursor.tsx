"use client";

import { useEffect, useRef } from "react";
import { useMotionQuality } from "@/lib/motion";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], [data-cursor-target], input, textarea, select";
const NATIVE_SELECTOR = "input, textarea, select, [data-native-cursor], [data-native-cursor] *";

export function CoconutCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -80, y: -80 });
  const currentRef = useRef({ x: -80, y: -80 });
  const frameRef = useRef<number | null>(null);
  const quality = useMotionQuality();

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cursor = cursorRef.current;
    if (!cursor || quality !== "full" || !finePointer.matches) return;

    document.documentElement.dataset.coCursor = "on";
    const paint = () => {
      frameRef.current = null;
      const deltaX = targetRef.current.x - currentRef.current.x;
      const deltaY = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += deltaX * 0.24;
      currentRef.current.y += deltaY * 0.24;
      const rotation = Math.max(-7, Math.min(7, deltaX * 0.12));
      cursor.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) rotate(${rotation}deg)`;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 0.35) schedulePaint();
    };
    const schedulePaint = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetRef.current = { x: event.clientX, y: event.clientY };
      cursor.dataset.visible = "true";
      schedulePaint();
    };
    const over = (event: PointerEvent) => {
      const source = event.target as Element | null;
      const element = source?.closest(INTERACTIVE_SELECTOR);
      const native = source?.matches(NATIVE_SELECTOR) || Boolean(source?.closest("[data-native-cursor]"));
      cursor.dataset.target = element ? "true" : "false";
      cursor.dataset.native = native ? "true" : "false";
    };
    const down = () => { cursor.dataset.pressed = "true"; };
    const up = () => { cursor.dataset.pressed = "false"; };
    const leave = () => { cursor.dataset.visible = "false"; };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      delete document.documentElement.dataset.coCursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [quality]);

  return (
    <>
      <div ref={cursorRef} className="co-coconut-cursor" aria-hidden="true" data-coconut-cursor data-visible="false" data-target="false" data-native="false" data-pressed="false">
        <span className="co-coconut-cursor__echo"/>
        <span className="co-coconut-cursor__half co-coconut-cursor__half--left"/>
        <span className="co-coconut-cursor__half co-coconut-cursor__half--right"/>
      </div>
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          html[data-co-cursor="on"] body,
          html[data-co-cursor="on"] a,
          html[data-co-cursor="on"] button,
          html[data-co-cursor="on"] [role="button"],
          html[data-co-cursor="on"] [data-cursor-target] { cursor: none !important; }
          html[data-co-cursor="on"] input,
          html[data-co-cursor="on"] textarea,
          html[data-co-cursor="on"] select,
          html[data-co-cursor="on"] [data-native-cursor],
          html[data-co-cursor="on"] [data-native-cursor] * { cursor: auto !important; }
        }
        .co-coconut-cursor {
          position: fixed;
          z-index: 9999;
          left: -20px;
          top: -20px;
          width: 40px;
          height: 40px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 180ms ease, filter 260ms ease;
          will-change: transform;
        }
        .co-coconut-cursor[data-visible="true"] { opacity: .92; }
        .co-coconut-cursor[data-native="true"] { opacity: 0; }
        .co-coconut-cursor__half {
          position: absolute;
          inset: 0;
          background: url('/assets/motion/coconut-cursor.png') center / contain no-repeat;
          transition: transform 360ms cubic-bezier(.16,1,.3,1);
          will-change: transform;
        }
        .co-coconut-cursor__half--left { clip-path: polygon(0 0, 52% 0, 47% 100%, 0 100%); }
        .co-coconut-cursor__half--right { clip-path: polygon(52% 0, 100% 0, 100% 100%, 47% 100%); }
        .co-coconut-cursor[data-target="true"] { filter: drop-shadow(0 5px 10px rgba(33,77,43,.2)); }
        .co-coconut-cursor[data-target="true"] .co-coconut-cursor__half { transform: scale(1.16); }
        .co-coconut-cursor[data-pressed="true"] .co-coconut-cursor__half--left { transform: translate3d(-5px,2px,0) rotate(-10deg) scale(.98); }
        .co-coconut-cursor[data-pressed="true"] .co-coconut-cursor__half--right { transform: translate3d(5px,-1px,0) rotate(9deg) scale(.98); }
        .co-coconut-cursor__echo {
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(33,77,43,.36);
          border-radius: 50%;
          opacity: 0;
          transform: scale(.5);
        }
        .co-coconut-cursor[data-pressed="true"] .co-coconut-cursor__echo { animation: co-cursor-water 520ms cubic-bezier(.16,1,.3,1); }
        @keyframes co-cursor-water { 0% { opacity: .55; transform: scale(.45); } 100% { opacity: 0; transform: scale(1.9); } }
        @media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) { .co-coconut-cursor { display: none !important; } }
      `}</style>
    </>
  );
}
