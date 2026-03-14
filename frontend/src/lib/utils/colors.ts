import type { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  { name: "Random Thoughts", color: "#78ABA8" },
  { name: "School", color: "#FCDC94" },
  { name: "Personal", color: "#EF9C66" },
];

export const CATEGORY_COLOR_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color]),
);

/** Returns a 50% lighter version of a hex color by mixing with white */
export function lightenColor(hex: string, amount = 0.5): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);

  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}
