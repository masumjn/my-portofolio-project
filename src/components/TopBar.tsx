"use client";

import React from "react";
import Link from "next/link";

interface TopBarProps {
  progress?: number;
  leftLabel?: string;
  rightLabel?: string;
  isLoaded?: boolean;
  currentRoute?: "home" | "projects" | "craft";
  onJumpToRatio?: (ratio: number) => void;
}

export default function TopBar({
  progress = 0,
  leftLabel = "",
  rightLabel = "",
  isLoaded = true,
  currentRoute = "home",
  onJumpToRatio,
}: TopBarProps) {
  const TOTAL_LINES = 20;
  const LINE_WIDTH = 1;
  const LINE_GAP = 9;
  const TRACK_WIDTH = TOTAL_LINES * LINE_WIDTH + (TOTAL_LINES - 1) * LINE_GAP; // 191px
  const TRACKER_WIDTH = 30;
  const MAX_TRANSLATE = TRACK_WIDTH - TRACKER_WIDTH; // 161px

  // ========================================================
  // A. MODE SUB-PAGE (Craft & Projects)
  // Susunan: [Kotak 1] -> [4 Garis] -> [Kotak 2] -> [4 Garis] -> [Kotak 3]
  // ========================================================
  if (currentRoute === "projects" || currentRoute === "craft") {
    const LINE_OPACITIES = [
      0, 0, 0, 0, // Slot Kotak 1: Home (0 - 30px)
      1, 1, 1, 1, // 4 Garis Pembatas Pertama (40, 50, 60, 70px)
      0, 0, 0, 0, // Slot Kotak 2: Craft (80 - 110px)
      1, 1, 1, 1, // 4 Garis Pembatas Kedua (120, 130, 140, 150px)
      0, 0, 0, 0, // Slot Kotak 3: Projects (160 - 190px)
    ];

    return (
      <header className="fixed top-8 left-0 w-full flex items-center justify-center z-50 pointer-events-none select-none">
        <div
          className="relative pointer-events-auto cursor-none"
          style={{
            width: `${TRACK_WIDTH}px`,
            height: "18px",
            lineHeight: "18px",
          }}
        >
          {/* Deretan 20 Garis Grid */}
          <div className="absolute top-0 left-0 flex items-center h-[18px] w-full pointer-events-none">
            {Array.from({ length: TOTAL_LINES }).map((_, idx) => (
              <div
                key={idx}
                className="w-[1px] h-[18px] shrink-0"
                style={{
                  marginRight: idx < TOTAL_LINES - 1 ? `${LINE_GAP}px` : "0px",
                  backgroundColor: "var(--colors-gray9)",
                  opacity: LINE_OPACITIES[idx],
                }}
              />
            ))}
          </div>

          {/* KOTAK 1: HOME (0px) */}
          <Link
            href="/"
            aria-label="Home"
            className="absolute top-0 left-0 w-[30px] h-[18px] box-border border border-[var(--colors-gray9)] bg-transparent hover:bg-black/10 transition-colors pointer-events-auto cursor-none z-30 block"
          />

          {/* KOTAK 2: CRAFT (80px) */}
          {currentRoute === "craft" ? (
            <div
              aria-label="Craft (Active)"
              className="absolute top-0 left-[80px] w-[30px] h-[18px] box-border z-30 pointer-events-none block"
              style={{
                backgroundColor: "var(--yellow)",
                border: "none",
              }}
            />
          ) : (
            <Link
              href="/craft"
              aria-label="Craft"
              className="absolute top-0 left-[80px] w-[30px] h-[18px] box-border border border-[var(--colors-gray9)] bg-transparent hover:bg-black/10 transition-colors pointer-events-auto cursor-none z-30 block"
            />
          )}

          {/* KOTAK 3: PROJECTS (160px) */}
          {currentRoute === "projects" ? (
            <div
              aria-label="Projects (Active)"
              className="absolute top-0 left-[160px] w-[30px] h-[18px] box-border z-30 pointer-events-none block"
              style={{
                backgroundColor: "var(--yellow)",
                border: "none",
              }}
            />
          ) : (
            <Link
              href="/projects"
              aria-label="Projects"
              className="absolute top-0 left-[160px] w-[30px] h-[18px] box-border border border-[var(--colors-gray9)] bg-transparent hover:bg-black/10 transition-colors pointer-events-auto cursor-none z-30 block"
            />
          )}
        </div>
      </header>
    );
  }

  // ========================================================
  // B. MODE HOME (Scrubber Dinamis & Anchor Jump)
  // ========================================================
  const trackerX = Math.max(0, Math.min(MAX_TRANSLATE, progress * MAX_TRANSLATE));

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onJumpToRatio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX >= 75 && clickX <= 115) {
      window.location.href = "/craft";
      return;
    }
    if (clickX >= 155 && clickX <= 195) {
      window.location.href = "/projects";
      return;
    }
    if (clickX <= 35) {
      onJumpToRatio(0);
      return;
    }

    const ratio = Math.max(0, Math.min(1, clickX / TRACK_WIDTH));
    onJumpToRatio(ratio);
  };

  return (
    <header
      className={`fixed top-8 left-0 w-full px-8 md:px-16 flex items-center justify-between z-50 pointer-events-none select-none transition-opacity duration-500 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDelay: "600ms" }}
    >
      {/* Label Kiri */}
      <div className="w-1/3 text-left font-mono text-xs tracking-tight text-neutral-500 transition-opacity duration-200 pointer-events-none">
        {leftLabel}
      </div>

      {/* Minimap Ruler Flat */}
      <div className="w-1/3 flex justify-center pointer-events-none">
        <div
          onClick={handleTrackClick}
          className="relative h-[18px] pointer-events-auto cursor-none"
          style={{ width: `${TRACK_WIDTH}px`, height: "18px" }}
        >
          <div className="absolute top-0 left-0 flex items-center h-[18px] w-full pointer-events-none">
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

          {/* Scrubber Kuning Dinamis */}
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

          {/* Hitbox Navigasi Cepat Home Mode */}
          <Link
            href="/craft"
            aria-label="Craft"
            className="absolute top-0 left-[80px] w-[30px] h-[18px] z-30 pointer-events-auto cursor-none opacity-0 block"
            onClick={(e) => e.stopPropagation()}
          />
          <Link
            href="/projects"
            aria-label="Projects"
            className="absolute top-0 left-[160px] w-[30px] h-[18px] z-30 pointer-events-auto cursor-none opacity-0 block"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Label Kanan */}
      <div className="w-1/3 text-right font-mono text-xs tracking-tight text-neutral-500 transition-opacity duration-200 pointer-events-none">
        {rightLabel}
      </div>
    </header>
  );
}