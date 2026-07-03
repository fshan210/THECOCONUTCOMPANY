"use client";

import { useEffect } from "react";

let activeLocks = 0;
let savedScrollY = 0;
let previousStyles: Partial<Record<"overflow" | "paddingRight" | "position" | "top" | "width", string>> = {};

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    activeLocks += 1;
    if (activeLocks === 1) {
      const body = document.body;
      const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      savedScrollY = window.scrollY;
      previousStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width
      };
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${savedScrollY}px`;
      body.style.width = "100%";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks !== 0) return;
      const body = document.body;
      body.style.overflow = previousStyles.overflow ?? "";
      body.style.paddingRight = previousStyles.paddingRight ?? "";
      body.style.position = previousStyles.position ?? "";
      body.style.top = previousStyles.top ?? "";
      body.style.width = previousStyles.width ?? "";
      window.scrollTo({ top: savedScrollY, behavior: "auto" });
    };
  }, [active]);
}
