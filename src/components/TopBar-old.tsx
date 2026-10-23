"use client";

import React from "react";

interface TopBarProps {
  progress: number;
  leftLabel: string;
  rightLabel: string;
  isLoaded: boolean;
  onJumpToRatio: (ratio: number) => void;
}

export default function TopBar({
  progress,
  leftLabel,
  rightLabel,
  isLoaded,
  onJumpToRatio,
}: TopBarProps) {
  const TOTAL_LINES = 20;
  const LINE_WIDTH = 1;
  const LINE_GAP = 9;
  const TRACK_WIDTH = TOTAL_LINES * LINE_WIDTH + (TOTAL_LINES - 1) * LINE_GAP; // 191px
  const TRACKER_WIDTH = 30;
  const MAX_TRANSLATE = TRACK_WIDTH - TRACKER_WIDTH; // 161px

  const trackerX = Math.max(0, Math.min(MAX_TRANSLATE, progress * MAX_TRANSLATE));

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / TRACK_WIDTH));
    onJumpToRatio(ratio);
  };

  return (
    <header
      className={`fixed top-6 left-0 w-full px-8 md:px-16 flex items-center justify-between z-40 pointer-events-none select-none transition-opacity duration-500 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDelay: "600ms" }}
    >
      {/* Label Kiri: Seksi Aktif */}
      <div className="w-1/3 text-left font-mono text-xs tracking-tight text-neutral-500 transition-opacity duration-200">
        {leftLabel}
      </div>

      {/* Minimap Ruler Flat */}
      <div className="w-1/3 flex justify-center pointer-events-auto">
        <div
          onClick={handleTrackClick}
          className="relative h-[18px] cursor-pointer"
          style={{ width: `${TRACK_WIDTH}px` }}
          title="Navigasi Minimap"
        >
          {/* 20 Garis Vertikal Dinamis */}
          <div className="relative z-10 flex items-center h-full w-full pointer-events-none">
            {Array.from({ length: TOTAL_LINES }).map((_, idx) => {
              const lineX = idx * (LINE_WIDTH + LINE_GAP);
              const isOccluded =
                lineX >= trackerX - 1 && lineX <= trackerX + TRACKER_WIDTH - 2;

              return (
                <div
                  key={idx}
                  className="minimap_line__YJFDK shrink-0 transition-opacity duration-150 ease-out"
                  style={{
                    width: `${LINE_WIDTH}px`,
                    height: "18px",
                    marginRight: idx < TOTAL_LINES - 1 ? `${LINE_GAP}px` : "0px",
                    backgroundColor: "var(--colors-gray9)",
                    opacity: isOccluded ? 0 : 1,
                  }}
                />
              );
            })}
          </div>

          {/* Hollow Rectangle Tracker (30px x 18px) */}
          <div
            className="minimap_tracker absolute top-0 left-0 z-20 pointer-events-none"
            style={{
              width: `${TRACKER_WIDTH}px`,
              height: "18px",
              border: "1px solid var(--colors-gray9)",
              backgroundColor: "var(--bg-stage)",
              borderRadius: "0px",
              transform: `translate3d(${trackerX}px, 0, 0)`,
              willChange: "transform",
            }}
          />
        </div>
      </div>

      {/* Label Kanan: Seksi Selanjutnya */}
      <div className="w-1/3 text-right font-mono text-xs tracking-tight text-neutral-500 transition-opacity duration-200">
        {rightLabel}
      </div>
    </header>
  );
}