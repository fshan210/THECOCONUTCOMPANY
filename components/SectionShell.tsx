import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  variant?: "paper" | "warm" | "brown";
};

const variants = {
  paper: "bg-paper text-coconut",
  warm: "bg-[#fff8ea] text-coconut",
  brown: "bg-coconut text-paper"
};

export function SectionShell({ children, className = "", variant = "paper" }: SectionShellProps) {
  return (
    <section className={`relative overflow-hidden px-5 py-16 md:px-8 md:py-24 lg:py-28 ${variants[variant]} ${className}`}>
      {children}
    </section>
  );
}
