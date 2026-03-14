"use client";

import Image from "next/image";
import { useMemo } from "react";

import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import type { Category } from "@/types/category";

type CategoryDropdownProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (id: number) => void;
};

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export function CategoryDropdown({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryDropdownProps) {
  const options = useMemo<DropdownOption<number>[]>(
    () =>
      categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
        icon: <ColorDot color={cat.color} />,
      })),
    [categories],
  );

  return (
    <Dropdown<number>
      options={options}
      value={selectedCategoryId}
      onSelect={onSelect}
      placeholder="Select category"
      className="w-[225px]"
      chevronIcon={
        <Image
          src="/static/assets/icons/chevron_down.svg"
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
        />
      }
    />
  );
}
