"use client";
import { Printer } from "lucide-react";
export function PrintButton() {
  return (
    <button className="cm-print" onClick={() => window.print()}>
      <Printer size={17} />
      Print this page
    </button>
  );
}
