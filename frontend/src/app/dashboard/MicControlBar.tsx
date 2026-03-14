"use client";

import Image from "next/image";

const BAR_COUNT = 9;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 24;

type MicControlBarProps = {
  audioLevel: number;
  onEndCall: () => void;
};

export function MicControlBar({ audioLevel, onEndCall }: MicControlBarProps) {
  const barHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const t = i / (BAR_COUNT - 1);
    const wave = 0.4 + 0.6 * Math.sin(t * Math.PI);
    const h = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * audioLevel * wave;
    return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, h));
  });

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black px-5 py-3 shadow-lg"
      role="toolbar"
      aria-label="Recording controls"
    >
      <button
        type="button"
        className="flex items-center justify-center transition-opacity hover:opacity-80"
        aria-label="Microphone"
      >
        <Image
          src="/static/assets/icons/mic.svg"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>

      <button
        type="button"
        onClick={onEndCall}
        className="flex items-center justify-center transition-opacity hover:opacity-80"
        aria-label="End recording"
      >
        <Image
          src="/static/assets/icons/end_call.svg"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>

      <div
        className="flex items-center justify-center gap-0.5"
        aria-hidden
        style={{ height: MAX_HEIGHT }}
      >
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-white transition-all duration-75"
            style={{ height: h }}
          />
        ))}
      </div>

      <button
        type="button"
        className="flex items-center justify-center transition-opacity hover:opacity-80"
        aria-label="Audio output"
      >
        <Image
          src="/static/assets/icons/headphones.svg"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </button>
    </div>
  );
}
