"use client";

import { CoconutLoader } from "@/components/motion/CoconutLoader";
import { isAccountRoute } from "@/lib/account/routes";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();
  if (isAccountRoute(pathname)) return null;
  return (
    <div className="co-route-transition" aria-label="Loading .CO experience">
      <div className="co-route-leaf" />
      <CoconutLoader mode="route" label="Gathering the good stuff" />
    </div>
  );
}
