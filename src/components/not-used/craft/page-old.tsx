"use client";

import React, { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import TopBar from "@/components/TopBar";
import WebInterfaceGuidelinesModal from "@/components/WebInterfaceGuidelinesModal";

interface CraftItemProps {
  title: string;
  date: string;
  theme?: "light" | "dark";
  topPosition?: boolean;
  buttonLabel?: string;
  aspectRatio?: string;
  bgGradient?: string;
  blurColor?: string;
  onOpenModal: () => void;
  children?: React.ReactNode;
}

function CraftCard({
  title,
  date,
  theme = "dark",
  topPosition = false,
  buttonLabel,
  aspectRatio = "16/10",
  bgGradient = "radial-gradient(circle at 50% 50%, #222, #0d0d0d)",
  blurColor,
  onOpenModal,
  children,
}: CraftItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        onOpenModal();
      }}
      className="group block w-full rounded-[12px] border border-[#e5e5e5] bg-white overflow-hidden mb-4 transition-all duration-200 cursor-none select-none hover:shadow-md active:scale-[0.99]"
      style={{ padding: buttonLabel ? "4px" : "0px" }}
    >
      <div
        className="relative w-full overflow-hidden rounded-[8px]"
        style={{ aspectRatio }}
      >
        {/* Progressive Blur Layer (LQIP) */}
        <div
          className="absolute inset-0 filter blur-[32px] scale-105 pointer-events-none"
          style={{
            background: blurColor || bgGradient,
            transform: "scale(1.05) translateZ(0)",
          }}
        />

        {/* Konten Display Internal */}
        <div
          className="relative z-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none"
          style={{ background: bgGradient }}
        >
          {children}
        </div>

        {/* Gradient Scrim */}
        <div
          className={`absolute inset-x-0 pointer-events-none z-10 ${
            topPosition
              ? "top-0 h-16 bg-gradient-to-b"
              : "bottom-0 h-16 bg-gradient-to-t"
          } ${
            theme === "dark"
              ? "from-black/80 to-transparent"
              : "from-white/90 to-transparent"
          }`}
        />

        {/* Bilah Metadata */}
        <div
          className={`absolute inset-x-0 z-20 flex items-center justify-between px-4 py-3 pointer-events-none ${
            topPosition ? "top-0" : "bottom-0"
          }`}
        >
          <span
            className={`text-[13px] font-normal tracking-tight truncate ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-[13px] font-normal font-mono shrink-0 ml-2 ${
              theme === "dark" ? "text-white/60" : "text-neutral-500"
            }`}
          >
            {date}
          </span>
        </div>
      </div>

      {/* Fake Action Button (Klik memicu Modal) */}
      {buttonLabel && (
        <div className="h-10 mt-1 bg-[#f0f0f0] group-hover:bg-[#e4e4e4] rounded-[8px] flex items-center justify-center text-[14px] font-medium text-neutral-900 transition-colors duration-150 pointer-events-none">
          {buttonLabel}
        </div>
      )}
    </div>
  );
}

export default function CraftPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-[#111111] cursor-none overflow-x-hidden">
      <CustomCursor />

      {/* TopBar Persisten (Mode Craft Aktif: Kotak Kuning di 80px) */}
      <TopBar currentRoute="craft" />

      {/* MODAL LIGHTBOX DRIBBLE: WEB INTERFACE GUIDELINES */}
      <WebInterfaceGuidelinesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Konten Utama 3-Column Masonry */}
      <main className="w-full pt-[124px] pb-28 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start w-full">

          {/* KOLOM 1 */}
          <div className="w-full md:w-1/3 flex flex-col">
            <CraftCard
              title="Posters"
              date="August 2026"
              theme="light"
              aspectRatio="16/9"
              bgGradient="radial-gradient(circle at center, #ffffff, #f4f4f4)"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-2 font-black text-xs tracking-widest text-neutral-800 opacity-80 uppercase">
                <span>MAKE</span>·<span>SOFT</span>·<span>WARE</span>
              </div>
            </CraftCard>

            <CraftCard
              title="History of Software Design"
              date="February 2026"
              theme="light"
              topPosition
              aspectRatio="16/9"
              buttonLabel="View Production"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <svg className="w-16 h-16 text-[#0000FF]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 1H11V6H13V8H15V10H17V16H15V18H11V20H7V18H5V8H7V1Z" fill="white" />
                <path d="M8 2H10V7H12V9H14V11H16V15H14V17H10V19H8V17H6V9H8V2Z" fill="#0000FF" />
              </svg>
            </CraftCard>

            <CraftCard
              title="DD Illustrations"
              date="July 2025"
              theme="light"
              aspectRatio="16/9"
              bgGradient="#f8f8f8"
              onOpenModal={handleOpenModal}
            >
              <div className="w-20 h-20 rounded-full bg-[#FF5722] opacity-90 filter blur-[1px]" />
            </CraftCard>

            <CraftCard
              title="Devouring Details"
              date="July 2025"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="View Production"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <span className="text-6xl font-black text-black tracking-tighter">DD</span>
            </CraftCard>

            <CraftCard
              title="Inline Conversion"
              date="November 2024"
              theme="dark"
              aspectRatio="2.9/1"
              bgGradient="linear-gradient(135deg, #181818, #000)"
              onOpenModal={handleOpenModal}
            >
              <div className="h-6 w-32 bg-white/10 rounded-full border border-white/20" />
            </CraftCard>

            <CraftCard
              title="Toolbar Morph"
              date="September 2024"
              theme="light"
              topPosition
              aspectRatio="1.18/1"
              bgGradient="#fafafa"
              onOpenModal={handleOpenModal}
            >
              <div className="p-3 bg-white rounded-lg shadow-sm border border-neutral-200 flex gap-2">
                <div className="w-4 h-4 bg-neutral-300 rounded-sm" />
                <div className="w-4 h-4 bg-neutral-300 rounded-sm" />
              </div>
            </CraftCard>

            <CraftCard
              title="X-Ray Interaction"
              date="May 2024"
              theme="dark"
              aspectRatio="1.37/1"
              buttonLabel="View Production"
              bgGradient="#0a0a0a"
              onOpenModal={handleOpenModal}
            >
              <div className="w-28 h-16 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center font-mono text-[10px] text-emerald-400">
                SECURITY_PASSED
              </div>
            </CraftCard>

            <CraftCard
              title="Blur Reveal"
              date="April 2024"
              theme="dark"
              aspectRatio="2.15/1"
              bgGradient="#0f0f0f"
              blurColor="radial-gradient(circle, #3b82f6 0%, #000000 70%)"
              onOpenModal={handleOpenModal}
            >
              <span className="text-white/40 font-mono text-sm filter blur-[2px]">BLUR_FILTER</span>
            </CraftCard>

            <CraftCard
              title="Word Lookup"
              date="January 2024"
              theme="light"
              topPosition
              aspectRatio="1.47/1"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="p-2 border border-neutral-300 rounded shadow-sm text-xs font-serif italic text-neutral-600">
                &ldquo;interaction&rdquo;
              </div>
            </CraftCard>

            <CraftCard
              title="SwiftUI Dock"
              date="December 2023"
              theme="dark"
              aspectRatio="16/9"
              bgGradient="#111"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="w-6 h-6 rounded-md bg-blue-500" />
                <div className="w-6 h-6 rounded-md bg-purple-500" />
                <div className="w-6 h-6 rounded-md bg-pink-500" />
              </div>
            </CraftCard>

            <CraftCard
              title="Invisible Details of Interaction Design"
              date="July 2023"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="Read Essay"
              bgGradient="#fdfdfd"
              onOpenModal={handleOpenModal}
            >
              <span className="font-serif italic text-lg text-neutral-800">Invisible Details</span>
            </CraftCard>

            <CraftCard
              title="Gooey Shader"
              date="September 2022"
              theme="dark"
              aspectRatio="1/1"
              bgGradient="radial-gradient(circle at 30% 30%, #ec4899, #8b5cf6 45%, #0f172a 80%)"
              blurColor="radial-gradient(circle, #ec4899, #8b5cf6)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-24 h-24 rounded-full bg-white/20 filter blur-[8px] animate-pulse" />
            </CraftCard>

            <CraftCard
              title="Tangerine Shader"
              date="September 2022"
              theme="dark"
              aspectRatio="1/1"
              bgGradient="radial-gradient(circle at 70% 30%, #f97316, #ea580c 45%, #18181b 85%)"
              blurColor="radial-gradient(circle, #f97316, #ea580c)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-20 h-20 rounded-full bg-orange-400/40 filter blur-[12px]" />
            </CraftCard>

            <CraftCard
              title="Blurred Icons"
              date="March 2022"
              theme="dark"
              aspectRatio="1.44/1"
              bgGradient="linear-gradient(135deg, #e0e7ff, #fce7f3)"
              onOpenModal={handleOpenModal}
            >
              <div className="p-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-lg flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/80 filter blur-[1px]" />
                <div className="w-8 h-8 rounded-lg bg-pink-500/80 filter blur-[1px]" />
                <div className="w-8 h-8 rounded-lg bg-amber-500/80 filter blur-[1px]" />
              </div>
            </CraftCard>
          </div>

          {/* KOLOM 2 */}
          <div className="w-full md:w-1/3 flex flex-col">
            <CraftCard
              title="DD System"
              date="June 2026"
              theme="light"
              topPosition
              aspectRatio="16/9"
              buttonLabel="View Production"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="flex flex-wrap gap-1 max-w-[200px] justify-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                    token_{i}
                  </span>
                ))}
              </div>
            </CraftCard>

            <CraftCard
              title="Novelty"
              date="February 2026"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="Read Essay"
              bgGradient="#fff"
              onOpenModal={handleOpenModal}
            >
              <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900">Novelty</span>
            </CraftCard>

            <CraftCard
              title="Testimonials"
              date="September 2025"
              theme="light"
              topPosition
              aspectRatio="1.65/1"
              buttonLabel="View Production"
              bgGradient="#fbfbfb"
              onOpenModal={handleOpenModal}
            >
              <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-sm max-w-[240px] text-[11px] text-neutral-600">
                &ldquo;Every detail crafted with absolute precision.&rdquo;
              </div>
            </CraftCard>

            <CraftCard
              title="Sidebar"
              date="February 2025"
              theme="dark"
              topPosition
              aspectRatio="1.32/1"
              bgGradient="#141414"
              onOpenModal={handleOpenModal}
            >
              <div className="w-36 h-24 bg-neutral-900 border border-neutral-800 rounded-md p-2 flex flex-col gap-1.5">
                <div className="h-2 w-16 bg-neutral-700 rounded" />
                <div className="h-2 w-24 bg-neutral-800 rounded" />
                <div className="h-2 w-20 bg-neutral-800 rounded" />
              </div>
            </CraftCard>

            <CraftCard
              title="Spatial Tooltip"
              date="September 2024"
              theme="light"
              aspectRatio="2.22/1"
              bgGradient="#fafafa"
              onOpenModal={handleOpenModal}
            >
              <div className="px-2.5 py-1 bg-black text-white text-[11px] rounded shadow-md">
                Spatial Coordinate
              </div>
            </CraftCard>

            <CraftCard
              title="Staggered Text"
              date="August 2024"
              theme="dark"
              aspectRatio="1.9/1"
              bgGradient="#111"
              onOpenModal={handleOpenModal}
            >
              <div className="font-mono text-xs text-neutral-300 space-y-0.5">
                <div className="ml-0">stagger()</div>
                <div className="ml-4 text-neutral-500">→ line_01</div>
                <div className="ml-8 text-neutral-600">→ line_02</div>
              </div>
            </CraftCard>

            <CraftCard
              title="Logo Carousel"
              date="May 2024"
              theme="light"
              aspectRatio="2.44/1"
              buttonLabel="View Prototype"
              bgGradient="#fff"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-4 items-center opacity-60">
                <div className="w-6 h-6 rounded bg-neutral-800" />
                <div className="w-6 h-6 rounded bg-neutral-800" />
                <div className="w-6 h-6 rounded bg-neutral-800" />
              </div>
            </CraftCard>

            <CraftCard
              title="Wheel Interface"
              date="April 2024"
              theme="light"
              aspectRatio="1.34/1"
              bgGradient="#f8f8f8"
              onOpenModal={handleOpenModal}
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neutral-800" />
              </div>
            </CraftCard>

            <CraftCard
              title="Contrasting Aesthetics"
              date="January 2024"
              theme="dark"
              aspectRatio="16/9"
              buttonLabel="Read Essay"
              bgGradient="#0a0a0a"
              onOpenModal={handleOpenModal}
            >
              <div className="grid grid-cols-6 gap-2 p-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i === 2 ? "bg-[#FF484C]" : "bg-white"}`}
                  />
                ))}
              </div>
            </CraftCard>

            <CraftCard
              title="SwiftUI Video Scrubber"
              date="September 2023"
              theme="dark"
              aspectRatio="1.16/1"
              bgGradient="#000"
              onOpenModal={handleOpenModal}
            >
              <div className="w-40 h-28 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-12 h-full bg-white rounded-full" />
                </div>
              </div>
            </CraftCard>

            <CraftCard
              title="Mirror Shader"
              date="September 2022"
              theme="dark"
              aspectRatio="1/1"
              bgGradient="radial-gradient(circle at center, #64748b, #0f172a 70%)"
              blurColor="radial-gradient(circle, #94a3b8, #0f172a)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-24 h-24 rounded-full border border-white/30 backdrop-blur-md" />
            </CraftCard>

            <CraftCard
              title="Animated Checkboxes"
              date="November 2021"
              theme="dark"
              aspectRatio="1/1"
              bgGradient="radial-gradient(circle at 50% 50%, #38bdf8, #818cf8 50%, #09090b 80%)"
              blurColor="radial-gradient(circle, #38bdf8, #818cf8)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-8 h-8 rounded-lg bg-white shadow-lg flex items-center justify-center text-black font-bold text-sm">
                ✓
              </div>
            </CraftCard>
          </div>

          {/* KOLOM 3 */}
          <div className="w-full md:w-1/3 flex flex-col">
            <CraftCard
              title="Vercel Agent"
              date="May 2026"
              theme="light"
              aspectRatio="1.53/1"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="font-mono text-xs px-3 py-1.5 rounded-md bg-neutral-100 border border-neutral-200">
                agent.run()
              </div>
            </CraftCard>

            <CraftCard
              title="Combobox"
              date="December 2025"
              theme="light"
              topPosition
              aspectRatio="1.6/1"
              bgGradient="#fafafa"
              onOpenModal={handleOpenModal}
            >
              <div className="w-36 px-2.5 py-1.5 bg-white rounded border border-neutral-300 shadow-sm text-xs text-neutral-500 flex justify-between items-center">
                <span>Select...</span>
                <span>▾</span>
              </div>
            </CraftCard>

            <CraftCard
              title="Next.js Dev Tools"
              date="February 2025"
              theme="light"
              topPosition
              aspectRatio="1.74/1"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white text-xs rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Next.js 15</span>
              </div>
            </CraftCard>

            <CraftCard
              title="Gooey Tooltip"
              date="September 2024"
              theme="dark"
              aspectRatio="1.56/1"
              bgGradient="#111"
              onOpenModal={handleOpenModal}
            >
              <div className="px-3 py-1 bg-white text-black text-xs font-medium rounded-full shadow-lg">
                Gooey Bubble
              </div>
            </CraftCard>

            <CraftCard
              title="Designing Depth"
              date="July 2024"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="Read Essay"
              bgGradient="#fefefe"
              onOpenModal={handleOpenModal}
            >
              <span className="font-serif italic text-lg text-neutral-800">Designing Depth</span>
            </CraftCard>

            <CraftCard
              title="Minimap"
              date="April 2024"
              theme="light"
              topPosition
              aspectRatio="1.95/1"
              buttonLabel="View Prototype"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-1 items-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[1px] h-3 bg-neutral-400" />
                ))}
              </div>
            </CraftCard>

            <CraftCard
              title="Running Diary"
              date="February 2024"
              theme="light"
              aspectRatio="1.44/1"
              buttonLabel="View Production"
              bgGradient="#ffffff"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-1 items-end h-8">
                <div className="w-1.5 h-3 bg-neutral-400 rounded-sm" />
                <div className="w-1.5 h-6 bg-neutral-700 rounded-sm" />
                <div className="w-1.5 h-8 bg-black rounded-sm" />
                <div className="w-1.5 h-5 bg-neutral-500 rounded-sm" />
              </div>
            </CraftCard>

            <CraftCard
              title="What will you ship?"
              date="December 2023"
              theme="dark"
              aspectRatio="1.23/1"
              buttonLabel="Read Essay"
              bgGradient="#0a0a0a"
              onOpenModal={handleOpenModal}
            >
              <span className="text-xl font-bold text-white text-center leading-snug">
                What will<br />you ship?
              </span>
            </CraftCard>

            <CraftCard
              title="SwiftUI Bezel Dock"
              date="September 2023"
              theme="dark"
              aspectRatio="2.64/1"
              bgGradient="#111"
              onOpenModal={handleOpenModal}
            >
              <div className="w-28 h-4 bg-white/10 rounded-full border border-white/20" />
            </CraftCard>

            <CraftCard
              title="Flume Shader"
              date="September 2022"
              theme="dark"
              aspectRatio="1/1"
              bgGradient="radial-gradient(circle at 40% 60%, #a855f7, #06b6d4 50%, #020617 80%)"
              blurColor="radial-gradient(circle, #a855f7, #06b6d4)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-20 h-20 rounded-full bg-cyan-400/30 filter blur-[10px]" />
            </CraftCard>

            <CraftCard
              title="Flashlight Tabs"
              date="October 2022"
              theme="dark"
              aspectRatio="1.87/1"
              buttonLabel="View Prototype"
              bgGradient="#0d0d0d"
              onOpenModal={handleOpenModal}
            >
              <div className="flex gap-1 p-1 bg-white/10 rounded-lg border border-white/10">
                <span className="px-2 py-0.5 text-[10px] bg-white text-black rounded font-medium">Tab 1</span>
                <span className="px-2 py-0.5 text-[10px] text-white/60">Tab 2</span>
              </div>
            </CraftCard>

            <CraftCard
              title="Liquid Swipe"
              date="December 2021"
              theme="dark"
              aspectRatio="1.23/1"
              bgGradient="radial-gradient(circle at 80% 50%, #3b82f6, #1d4ed8 40%, #09090b 80%)"
              blurColor="radial-gradient(circle, #3b82f6, #1d4ed8)"
              onOpenModal={handleOpenModal}
            >
              <div className="w-16 h-16 rounded-full bg-blue-400/30 filter blur-[6px]" />
            </CraftCard>
          </div>

        </div>
      </main>
    </div>
  );
}