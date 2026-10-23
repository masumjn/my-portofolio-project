"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  videoSrc?: string;
  onOpenModal: () => void;
  children?: React.ReactNode;
}

// 1. OPTIMALISASI: Membungkus CraftCard dengan React.memo (Caching Memori)
const CraftCard = React.memo(function CraftCard({
  title,
  date,
  theme = "dark",
  topPosition = false,
  buttonLabel,
  aspectRatio = "16/10",
  bgGradient = "radial-gradient(circle at 50% 50%, #222, #0d0d0d)",
  blurColor,
  videoSrc,
  onOpenModal,
  children,
}: CraftItemProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Lazy Loading Video (Zero-Payload Initial Load)
  useEffect(() => {
    if (!videoSrc || !videoContainerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect(); 
        }
      },
      { rootMargin: "400px" } 
    );
    
    observer.observe(videoContainerRef.current);
    
    return () => observer.disconnect();
  }, [videoSrc]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        onOpenModal();
      }}
      className="group block w-full rounded-[12px] border border-[#e5e5e5] bg-white overflow-hidden mb-4 transition-all duration-200 cursor-none select-none hover:shadow-md active:scale-[0.99] outline-none focus:outline-none"
      style={{ padding: buttonLabel ? "4px" : "0px" }}
    >
      <div
        className="relative w-full overflow-hidden rounded-[8px]"
        style={aspectRatio === "auto" ? { aspectRatio: "auto" } : { aspectRatio }}
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
          ref={videoContainerRef}
          className={`${
            aspectRatio === "auto" ? "relative h-auto" : "absolute inset-0 h-full"
          } z-0 w-full flex items-center justify-center overflow-hidden pointer-events-none rounded-[8px]`}
          style={{ background: bgGradient }}
        >
          {videoSrc ? (
            shouldLoadVideo && (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="none" 
                className="absolute inset-0 w-full h-full min-w-full min-h-full block object-cover object-center origin-center scale-[1.35]"
              />
            )
          ) : (
            children
          )}
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

      {/* Fake Action Button */}
      {buttonLabel && (
        <div className="h-10 mt-1 bg-[#f0f0f0] group-hover:bg-[#e4e4e4] rounded-[8px] flex items-center justify-center text-[14px] font-medium text-neutral-900 transition-colors duration-150 pointer-events-none">
          {buttonLabel}
        </div>
      )}
    </div>
  );
});

export default function CraftPage() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleOpenModal = useCallback((title: string) => setActiveItem(title), []);
  const handleCloseModal = useCallback(() => setActiveItem(null), []);

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-[#111111] cursor-none overflow-x-hidden">
      
      {/* KEYFRAMES KUSTOM UNTUK ANIMASI KARTU */}
      <style>{`
        /* ANIMASI SCROLL JETHUB */
        @keyframes autoScrollMockup {
          0%, 15% {
            transform: translate3d(0, 0, 0);
            animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
          }
          32%, 44% {
            transform: translate3d(0, -25%, 0);
            animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
          }
          62%, 78% {
            transform: translate3d(0, -50.5%, 0);
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          92%, 100% {
            transform: translate3d(0, 0, 0);
            animation-timing-function: linear;
          }
        }
        .animate-scroll-mockup {
          animation: autoScrollMockup 14s infinite;
          will-change: transform;
        }

        /* ANIMASI REDUP-NYALA TERRA DASHBOARD */
        @keyframes terraFadeA {
          0%, 35% { opacity: 1; animation-timing-function: ease-out; }
          48%, 50% { opacity: 0; }
          50%, 95% { opacity: 0; animation-timing-function: ease-in; }
          100% { opacity: 1; }
        }
        @keyframes terraFadeB {
          0%, 45% { opacity: 0; animation-timing-function: ease-in; }
          50%, 85% { opacity: 1; animation-timing-function: ease-out; }
          98%, 100% { opacity: 0; }
        }
        .animate-terra-a {
          animation: terraFadeA 10s infinite;
          will-change: opacity;
          transform: translateZ(0);
        }
        .animate-terra-b {
          animation: terraFadeB 10s infinite;
          will-change: opacity;
          transform: translateZ(0);
        }

        /* ANIMASI SCROLL LINEAR STATIS SUROBOYO SAMBAT */
        @keyframes autoScrollSuroboyo {
          0%, 8% {
            transform: translate3d(0, 0, 0);
            animation-timing-function: linear;
          }
          78%, 91% {
            transform: translate3d(0, -68%, 0);
            animation-timing-function: step-end;
          }
          92%, 100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-scroll-suroboyo {
          animation: autoScrollSuroboyo 14s infinite;
          will-change: transform;
        }

        /* ANIMASI TRANSISI KEDIPAN PUTIH (WHITE BLINK FLASH) */
        @keyframes whiteBlinkSuroboyo {
          0%, 84% { opacity: 0; }
          89%, 93% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        .animate-flash-suroboyo {
          animation: whiteBlinkSuroboyo 14s infinite;
          will-change: opacity;
        }

        /* ANIMASI SLIDESHOW GESER KE KIRI INFINITE (PTOS-M ALERT SYSTEM) */
        @keyframes ptosmAlertSlide {
          0%, 28% {
            transform: translate3d(0%, 0, 0);
          }
          33%, 61% {
            transform: translate3d(-25%, 0, 0);
          }
          66%, 94% {
            transform: translate3d(-50%, 0, 0);
          }
          99%, 100% {
            transform: translate3d(-75%, 0, 0);
          }
        }
        .animate-ptosm-alert-slide {
          animation: ptosmAlertSlide 11s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          will-change: transform;
        }
      `}</style>

      <CustomCursor />
      <TopBar currentRoute="craft" />
      <WebInterfaceGuidelinesModal
        isOpen={!!activeItem}
        title={activeItem || "Web Interface Guidelines"}
        onClose={handleCloseModal}
      />

      {/* Konten Utama 3-Column Masonry */}
      <main className="w-full pt-[124px] pb-28 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start w-full">

          {/* ======================================================== */}
          {/* KOLOM 1: PTOS-M (1) -> Harmoni (2) -> PTOS-M Alert (3)   */}
          {/* ======================================================== */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 1. PTOS-M OTP (May 2026) */}
            <CraftCard
              title="PTOS-M"
              date="May 2026"
              theme="dark"
              aspectRatio="16/9"
              buttonLabel="View"
              videoSrc="/videos/ptos-m.mp4"
              bgGradient="#0a2540"
              onOpenModal={() => handleOpenModal("PTOS-M")}
            />

            {/* 4. Harmoni IoT (May 2024) */}
            <CraftCard
              title="Harmoni IoT"
              date="May 2024"
              theme="dark"
              aspectRatio="16/9"
              buttonLabel="View"
              videoSrc="/videos/harmoni-iot.mp4"
              bgGradient="linear-gradient(to right, #8b5cf6, #ec4899)"
              onOpenModal={() => handleOpenModal("Harmoni IoT")}
            />

            {/* 7. KARTU BARU: PTOS-M Alert System (October 2026) - Slideshow Geser Kiri */}
            <CraftCard
              title="PTOS-M Alert System"
              date="October 2026"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="View"
              bgGradient="#0a2540"
              onOpenModal={() => handleOpenModal("PTOS-M Alert System")}
            >
              <div className="relative w-full h-full overflow-hidden">
                <div className="flex w-[400%] h-full animate-ptosm-alert-slide">
                  {/* Slide 1: Verifikasi Alert */}
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-verifikasi-warning.png"
                      alt="Alert Verifikasi"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  {/* Slide 2: Penetapan Stepper Alert */}
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-penetapan-partial.png"
                      alt="Alert Penetapan"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  {/* Slide 3: Cloudflare Gateway Alert */}
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-error-403.png"
                      alt="Alert Cloudflare"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  {/* Slide 4: Duplikat Slide 1 untuk Seamless Infinite Loop */}
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-verifikasi-warning.png"
                      alt="Alert Verifikasi Duplicate"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </CraftCard>

            <CraftCard
              title="Posters"
              date="August 2026"
              theme="light"
              aspectRatio="16/9"
              bgGradient="radial-gradient(circle at center, #ffffff, #f4f4f4)"
              onOpenModal={() => handleOpenModal("Posters")}
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
              onOpenModal={() => handleOpenModal("History of Software Design")}
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
              onOpenModal={() => handleOpenModal("DD Illustrations")}
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
              onOpenModal={() => handleOpenModal("Devouring Details")}
            >
              <span className="text-6xl font-black text-black tracking-tighter">DD</span>
            </CraftCard>

            <CraftCard
              title="Inline Conversion"
              date="November 2024"
              theme="dark"
              aspectRatio="2.9/1"
              bgGradient="linear-gradient(135deg, #181818, #000)"
              onOpenModal={() => handleOpenModal("Inline Conversion")}
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
              onOpenModal={() => handleOpenModal("Toolbar Morph")}
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
              onOpenModal={() => handleOpenModal("X-Ray Interaction")}
            >
              <div className="w-28 h-16 rounded border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center font-mono text-[10px] text-emerald-400">
                SECURITY_PASSED
              </div>
            </CraftCard>
          </div>

          {/* ========================================= */}
          {/* KOLOM 2: Terra -> Jet-Hub -> Dst         */}
          {/* ========================================= */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 2. Terra Dashboard (February 2024) */}
            <CraftCard
              title="Terra Dashboard"
              date="February 2024"
              theme="dark"
              topPosition
              aspectRatio="auto" 
              buttonLabel="View"
              bgGradient="#111111" 
              onOpenModal={() => handleOpenModal("Terra Dashboard")}
            >
              <div className="relative w-full h-auto">
                <img
                  src="/images/terra-dashboard.png"
                  alt="Terra Dashboard Main"
                  className="relative top-0 left-0 w-full h-auto object-cover animate-terra-a"
                />
                <img
                  src="/images/terra-pump.png"
                  alt="Terra Pump Controls"
                  className="absolute inset-0 w-full h-full object-cover animate-terra-b"
                />
              </div>
            </CraftCard>

            {/* 5. Jet-Hub E-Commerce (November 2024) */}
            <CraftCard
              title="Jet-Hub E-Commerce"
              date="November 2024"
              theme="light"
              topPosition
              aspectRatio="4/3"
              buttonLabel="View"
              bgGradient="#ffffff"
              onOpenModal={() => handleOpenModal("Jet-Hub E-Commerce")}
            >
              <img
                src="/images/jethub-product.png"
                alt="Jet-Hub E-Commerce Mockup"
                className="absolute top-0 left-0 w-full h-auto mt-0 animate-scroll-mockup origin-top object-top"
              />
            </CraftCard>

            <CraftCard
              title="DD System"
              date="June 2026"
              theme="light"
              topPosition
              aspectRatio="16/9"
              buttonLabel="View Production"
              bgGradient="#ffffff"
              onOpenModal={() => handleOpenModal("DD System")}
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
              onOpenModal={() => handleOpenModal("Novelty")}
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
              onOpenModal={() => handleOpenModal("Testimonials")}
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
              onOpenModal={() => handleOpenModal("Sidebar")}
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
              onOpenModal={() => handleOpenModal("Spatial Tooltip")}
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
              onOpenModal={() => handleOpenModal("Staggered Text")}
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
              onOpenModal={() => handleOpenModal("Logo Carousel")}
            >
              <div className="flex gap-4 items-center opacity-60">
                <div className="w-6 h-6 rounded bg-neutral-800" />
                <div className="w-6 h-6 rounded bg-neutral-800" />
                <div className="w-6 h-6 rounded bg-neutral-800" />
              </div>
            </CraftCard>
          </div>

          {/* ======================================================== */}
          {/* KOLOM 3: Smart Door-Lock -> Suroboyo Sambat -> Dst       */}
          {/* ======================================================== */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 3. Smart Door-Lock (September 2022) */}
            <CraftCard
              title="Smart Door-Lock"
              date="September 2022"
              theme="light"
              aspectRatio="16/9"
              buttonLabel="View"
              videoSrc="/videos/smart-door-lock.mp4"
              bgGradient="#e5e5e5"
              onOpenModal={() => handleOpenModal("Smart Door-Lock")}
            />

            {/* 6. Suroboyo Sambat (December 2024) - Gulir Linier + White Flash */}
            <CraftCard
              title="Suroboyo Sambat"
              date="December 2024"
              theme="light"
              topPosition
              aspectRatio="4/3"
              buttonLabel="View"
              bgGradient="#ffffff"
              onOpenModal={() => handleOpenModal("Suroboyo Sambat")}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/images/suroboyo-sambat.png"
                  alt="Suroboyo Sambat Mockup"
                  className="absolute top-0 left-0 w-full h-auto animate-scroll-suroboyo origin-top object-top"
                />
                <div className="absolute inset-0 bg-white pointer-events-none animate-flash-suroboyo z-10" />
              </div>
            </CraftCard>

            <CraftCard
              title="Wheel Interface"
              date="April 2024"
              theme="light"
              aspectRatio="1.34/1"
              bgGradient="#f8f8f8"
              onOpenModal={() => handleOpenModal("Wheel Interface")}
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
              onOpenModal={() => handleOpenModal("Contrasting Aesthetics")}
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
              onOpenModal={() => handleOpenModal("SwiftUI Video Scrubber")}
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
              onOpenModal={() => handleOpenModal("Mirror Shader")}
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
              onOpenModal={() => handleOpenModal("Animated Checkboxes")}
            >
              <div className="w-8 h-8 rounded-lg bg-white shadow-lg flex items-center justify-center text-black font-bold text-sm">
                ✓
              </div>
            </CraftCard>

            <CraftCard
              title="Vercel Agent"
              date="May 2026"
              theme="light"
              aspectRatio="1.53/1"
              bgGradient="#ffffff"
              onOpenModal={() => handleOpenModal("Vercel Agent")}
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
              onOpenModal={() => handleOpenModal("Combobox")}
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
              onOpenModal={() => handleOpenModal("Next.js Dev Tools")}
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
              onOpenModal={() => handleOpenModal("Gooey Tooltip")}
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
              onOpenModal={() => handleOpenModal("Designing Depth")}
            >
              <span className="font-serif italic text-lg text-neutral-800">Designing Depth</span>
            </CraftCard>
          </div>

        </div>
      </main>
    </div>
  );
}