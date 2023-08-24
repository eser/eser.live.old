import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@web/shared/lib/utils.ts";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md no-underline text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:text-destructive-foreground hover:bg-destructive/90",
        bright:
          "bg-bright text-bright-foreground shadow-sm hover:text-bright-foreground hover:bg-bright/90",
        safe:
          "bg-safe text-safe-foreground shadow-sm hover:text-safe-foreground hover:bg-safe/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-link underline-offset-4 hover:underline hover:text-link-hover",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonHTMLAttributes<T extends EventTarget>
  extends React.HTMLAttributes<T> {
  disabled?: boolean | undefined;
  form?: string | undefined;
  formAction?: string | undefined;
  formEncType?: string | undefined;
  formMethod?: string | undefined;
  formNoValidate?: boolean | undefined;
  formTarget?: string | undefined;
  name?: string | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  value?:
    | string
    | string[]
    | number
    | undefined
    | React.JSX.SignalLike<string | string[] | number | undefined>;
}

type HTMLButtonElementButSize = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "size"
>;

export interface ButtonProps
  extends HTMLButtonElementButSize, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
