import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-center text-foreground/80">{message}</p>
      <Button
        type="button"
        variant="filled"
        fullWidth={false}
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}
