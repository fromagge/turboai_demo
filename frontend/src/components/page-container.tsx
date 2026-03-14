import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center bg-background",
        className,
      )}
    >
      {children}
    </main>
  );
}
