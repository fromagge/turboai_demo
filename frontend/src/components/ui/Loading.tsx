import { cn } from "@/lib/utils/cn";

export function Loading({ className }: { className?: string }) {
  return <p className={cn("text-foreground", className)}>Loading...</p>;
}
