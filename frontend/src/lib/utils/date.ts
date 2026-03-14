export function formatNoteDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const then = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - then.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
