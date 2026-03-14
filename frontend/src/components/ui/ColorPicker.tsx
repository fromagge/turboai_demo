"use client";

import { useEffect, useRef, useState } from "react";

import { PRESET_COLORS } from "@/lib/constants/colors";

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative w-fit shrink-0">
      <button
        type="button"
        className="m-0 block min-h-0 shrink-0 cursor-pointer rounded-full border-0 p-0 leading-none"
        style={{
          width: "11px",
          height: "11px",
          backgroundColor: value,
        }}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute top-5 left-0 z-20 grid grid-cols-5 gap-2.5 rounded-card border border-border bg-background p-3 shadow-md">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className="cursor-pointer rounded-full ring-offset-1"
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: color,
                outline:
                  value === color ? "2px solid var(--color-border)" : "none",
                outlineOffset: "2px",
              }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
