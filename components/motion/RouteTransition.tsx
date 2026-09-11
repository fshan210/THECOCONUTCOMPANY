import type { ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  return <div data-motion-element="route-shell">{children}</div>;
}
