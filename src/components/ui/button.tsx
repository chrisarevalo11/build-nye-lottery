import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-start group relative flex flex-col overflow-hidden px-3 py-1.5 text-sm font-medium ring-offset-background transition-all *:h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-80",
  {
    variants: {
      variant: {
        default: "text-gray bg-background hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-background bg-transparent text-background hover:opacity-90",
        outlineWhite:
          "border-gray text-gray border bg-transparent hover:opacity-90",
        white: "bg-gray text-background hover:opacity-80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-fit",
        lg: "h-11",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="grid w-full place-content-center overflow-hidden">
          <span className="relative inset-0 inline-flex !min-h-full items-center justify-center gap-1 whitespace-nowrap transition-all group-hover:-translate-y-[200%]">
            {props.children}
          </span>
          <span className="absolute bottom-[-100%] left-0 right-0 mx-auto inline-flex min-h-full items-center justify-center gap-1 whitespace-nowrap transition-all group-hover:translate-y-[-100%]">
            {props.children}
          </span>
        </span>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
