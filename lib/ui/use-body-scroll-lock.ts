"use client";

import { useEffect } from "react";

let activeLocks = 0;
let savedScrollY = 0;
let previousStyles: Partial<Record<"overflow" | "paddingRight" | "position" | "top" | "width", string>> = {};
let previousRootOverflow = "";
let previousRootOverscroll = "";
let lockObserver: MutationObserver | null = null;

const holdScrollPosition = () => {
  if (activeLocks > 0 && Math.abs(window.scrollY - savedScrollY) > 1) {
    window.scrollTo({ top: savedScrollY, behavior: "auto" });
  }
};

const enforceBodyLock = () => {
  if (activeLocks === 0) return;
  const body = document.body;
  if (body.style.getPropertyValue("position") !== "fixed" || body.style.getPropertyPriority("position") !== "important") {
    body.style.setProperty("position", "fixed", "important");
  }
  if (body.style.getPropertyValue("top") !== `-${savedScrollY}px`) body.style.top = `-${savedScrollY}px`;
  if (body.style.getPropertyValue("width") !== "100%") body.style.width = "100%";
  if (body.style.getPropertyValue("overflow") !== "hidden") body.style.overflow = "hidden";
};

export function useBodyScrollLock(active: boolean, lockedScrollY?: number) {
  useEffect(() => {
    if (!active) return;
    activeLocks += 1;
    if (activeLocks === 1) {
      const body = document.body;
      const root = document.documentElement;
      const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      savedScrollY = lockedScrollY ?? window.scrollY;
      previousStyles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width
      };
      previousRootOverflow = root.style.overflow;
      previousRootOverscroll = root.style.overscrollBehavior;
      root.style.overflow = "hidden";
      root.style.overscrollBehavior = "none";
      body.style.overflow = "hidden";
      body.style.setProperty("position", "fixed", "important");
      body.style.top = `-${savedScrollY}px`;
      body.style.width = "100%";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
      window.addEventListener("scroll", holdScrollPosition, { passive: true });
      lockObserver = new MutationObserver(enforceBodyLock);
      lockObserver.observe(body, { attributes: true, attributeFilter: ["style"] });
    }
    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks !== 0) return;
      const body = document.body;
      const root = document.documentElement;
      lockObserver?.disconnect();
      lockObserver = null;
      window.removeEventListener("scroll", holdScrollPosition);
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overflow = previousStyles.overflow ?? "";
      body.style.paddingRight = previousStyles.paddingRight ?? "";
      body.style.removeProperty("position");
      if (previousStyles.position) body.style.position = previousStyles.position;
      body.style.top = previousStyles.top ?? "";
      body.style.width = previousStyles.width ?? "";
      window.scrollTo({ top: savedScrollY, behavior: "auto" });
    };
  }, [active, lockedScrollY]);
}
