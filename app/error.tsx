"use client";
import { RecoverySurface } from "@/components/commerce/RecoverySurface";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RecoverySurface kind="500" retry={reset} />;
}
