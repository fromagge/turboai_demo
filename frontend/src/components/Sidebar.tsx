import { CATEGORIES } from "@/lib/utils/colors";
import type { Category } from "@/types/category";

export function Sidebar({
  categories = CATEGORIES,
}: {
  categories?: Category[];
}) {
  return (
    <aside className="shrink-0 w-64 bg-transparent p-6 pt-24">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-bold leading-[100%] tracking-normal text-black mb-2">
          All categories
        </span>
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <span
              className="shrink-0 rounded-full"
              style={{
                width: "11px",
                height: "11px",
                backgroundColor: category.color,
              }}
            />
            <span className="text-xs font-normal leading-[100%] tracking-normal text-black">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
