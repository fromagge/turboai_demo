"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

export type DropdownOption<T extends string | number = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type DropdownProps<T extends string | number = string> = {
  options: DropdownOption<T>[];
  value: T | null;
  onSelect: (value: T) => void;
  placeholder?: string;
  className?: string;

  chevronIcon?: React.ReactNode;
};

export function Dropdown<T extends string | number = string>({
  options,
  value,
  onSelect,
  placeholder = "Select...",
  className,

  chevronIcon,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "cursor-pointer flex w-full items-center gap-2 rounded-[6px] border border-border px-4 py-2 text-sm font-bold transition-colors hover:bg-button-hover",
          selected ? "text-black" : "text-black/50",
        )}
      >
        <span className="min-w-0 flex-1 flex items-center gap-2 overflow-hidden">
          {selected ? (
            <>
              {selected.icon}
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </span>
        {chevronIcon ? (
          <span
            className={cn(
              "ml-1 shrink-0 inline-block transition-transform",
              open && "rotate-180",
            )}
          >
            {chevronIcon}
          </span>
        ) : (
          <svg
            className={cn(
              "ml-1 h-4 w-4 shrink-0 transition-transform",
              open && "rotate-180",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {open && (
        <ul className="absolute left-0 z-20 mt-1 max-h-60 w-56 overflow-auto rounded-[6px] border border-border bg-background p-1 shadow-md">
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-black/50">No options</li>
          )}
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-sm text-black hover:bg-button-hover",
                  opt.value === value && "font-bold",
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
