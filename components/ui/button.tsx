import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[24px] text-sm font-bold transition-[transform,box-shadow,background-color,border-color,color] duration-500 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(216,192,122,0.5)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "border border-[var(--co-black)] bg-[var(--co-black)] text-[var(--co-white)] shadow-soft hover:-translate-y-0.5 hover:bg-[var(--co-palm)] hover:border-[var(--co-palm)]",
        leaf: "border border-[var(--co-palm)] bg-[var(--co-palm)] text-[var(--co-white)] shadow-soft hover:-translate-y-0.5 hover:bg-[var(--co-black)] hover:border-[var(--co-black)]",
        outline: "border border-[var(--co-border)] bg-transparent text-[var(--co-brown)] hover:-translate-y-0.5 hover:bg-[var(--co-white)]",
        glass: "co-premium-glass text-[var(--co-brown)] hover:-translate-y-0.5",
        ghost: "text-[var(--co-brown)] hover:bg-[rgba(255,255,255,0.48)]"
      },
      size: {
        default: "px-6 py-3",
        sm: "min-h-10 px-4 py-2 text-xs",
        lg: "min-h-14 px-8 py-4 text-base",
        icon: "size-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
