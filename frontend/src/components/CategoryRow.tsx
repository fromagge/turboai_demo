import { CloseIcon } from "@/components/ui/CloseIcon";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types/category";

export interface CategoryRowProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
  onColorChange: (id: number, color: string) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function CategoryRow({
  category,
  isSelected,
  onSelect,
  onColorChange,
  onDelete,
  isDeleting,
}: CategoryRowProps) {
  const canDelete = category.note_count === 0;

  return (
    <div className="group flex items-center gap-2">
      <ColorPicker
        value={category.color}
        onChange={(color) => onColorChange(category.id, color)}
      />
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "cursor-pointer text-xs leading-[100%] tracking-normal text-black",
          isSelected ? "font-bold" : "font-normal",
        )}
      >
        {category.name}
      </button>
      <span className="ml-auto text-[10px] text-black">
        {category.note_count}
      </span>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(category.id)}
          disabled={isDeleting}
          className="hidden h-0 w-0 cursor-pointer opacity-50 hover:opacity-100 group-hover:block group-hover:h-auto group-hover:w-auto"
        >
          <CloseIcon size={10} />
        </button>
      )}
    </div>
  );
}
