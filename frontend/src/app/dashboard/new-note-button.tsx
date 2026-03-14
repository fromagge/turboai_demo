"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

export function NewNoteButton() {
  return (
    <div className="absolute right-6 -top-16 z-10">
      <Button
        type="button"
        variant="outline"
        fullWidth={false}
        className="flex h-11 w-32 items-center justify-center gap-2"
      >
        <Image
          src="/static/assets/icons/plus.svg"
          alt=""
          width={16}
          height={16}
        />
        <span className="text-sm font-bold leading-none">New Note</span>
      </Button>
    </div>
  );
}
