import { cn } from "@/lib/utils/cn";

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
        "flex min-h-screen w-full items-center justify-center bg-background",
        className,
      )}
    >
      {children}
    </main>
  );
}
