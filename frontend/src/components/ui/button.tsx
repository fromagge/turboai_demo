import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "filled";
};

export function Button({
  className,
  variant = "outline",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "w-full cursor-pointer rounded-button border border-border px-4 py-2 font-bold hover:bg-button-hover disabled:opacity-50",
        variant === "outline" && "text-foreground",
        variant === "filled" && "bg-foreground text-background",
        className,
      )}
      {...props}
    />
  );
}
