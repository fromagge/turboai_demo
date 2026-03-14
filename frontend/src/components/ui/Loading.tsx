import { cn } from "@/lib/utils/cn";

export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center",
        className,
      )}
    >
      <p className="text-foreground">Loading...</p>
    </div>
  );
}
