export function sortByUpdatedAt<T extends { updated_at: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}
