"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  variant?: "default" | "ghost";
};

const variantStyles = {
  default:
    "rounded-input border border-input-border bg-background focus:ring-1 focus:ring-border focus:border-border h-11 px-3 py-2",
  ghost:
    "border-0 bg-transparent text-xs text-black outline-none placeholder:text-black/40 focus:ring-0",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant = "default", ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={cn(
            "block w-full text-foreground focus:outline-none",
            variantStyles[variant],
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
