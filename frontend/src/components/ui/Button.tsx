import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "filled";
  fullWidth?: boolean;
};

export function Button({
  className,
  variant = "outline",
  fullWidth = true,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-button border border-border px-4 py-2 font-bold hover:bg-button-hover disabled:opacity-50",
        fullWidth && "w-full",
        variant === "outline" && "text-foreground",
        variant === "filled" && "bg-foreground text-background",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
