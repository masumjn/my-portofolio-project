"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import TopBar from "@/components/TopBar";

const MAX_SCROLL_DISTANCE = 8680;

// FUNGSI SOFT-LANDING CLAMPING (Linear 0-70% -> Cubic Ease-Out 70-100% -> Clamped)
function softLandingEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  if (t < 0.7) {
    return 1.25 * t;
  }

  const u = (t - 0.7) / 0.3;
  return 0.875 + 0.125 * (1 - Math.pow(1 - u, 3));
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [leftLabel, setLeftLabel] = useState("");
  const [rightLabel, setRightLabel] = useState("Enterprise Systems");
  const [copied, setCopied] = useState(false);

  const framesRef = useRef<HTMLDivElement>(null);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const isInitialLocked = useRef(true);

  // Refs untuk track geser internal aperture slide
  const ddContentRef = useRef<HTMLDivElement>(null);
  const craftContentRef = useRef<HTMLDivElement>(null);
  const projectsContentRef = useRef<HTMLDivElement>(null);

  // 1. INISIALISASI RESTORATION & INITIAL ENTRANCE
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    const lockTimer = setTimeout(() => {
      isInitialLocked.current = false;
    }, 500);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(lockTimer);
    };
  }, []);

  // 2. NAVIGASI ARROW KEYBOARD (KIRI & KANAN) & TRACKPAD HORIZONTAL
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const STEP = 480;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextY = Math.min(MAX_SCROLL_DISTANCE, window.scrollY + STEP);
        window.scrollTo({ top: nextY, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevY = Math.max(0, window.scrollY - STEP);
        window.scrollTo({ top: prevY, behavior: "smooth" });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaX });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 3. ENGINE RENDER INERTIA & PARALLAX TRANSFORMS
  useEffect(() => {
    let animId: number;

    const render = () => {
      const diff = targetScrollY.current - currentScrollY.current;
      if (Math.abs(diff) < 0.05) {
        currentScrollY.current = targetScrollY.current;
      } else {
        currentScrollY.current += diff * 0.08;
      }

      const curY = currentScrollY.current;

      // Uniform Global Scale (1.12x -> 1.0x pada 400px pertama)
      let globalScale = 1.0;
      if (curY <= 0) {
        globalScale = 1.12;
      } else if (curY < 400) {
        globalScale = 1.12 - (curY / 400) * 0.12;
      } else {
        globalScale = 1.0;
      }

      // Translasi kanvas utama
      if (framesRef.current) {
        framesRef.current.style.transform = `translate3d(${-curY}px, 0, 0) scale(${globalScale})`;
      }

      // Early Completion & Soft-Landing Clamping Parallax
      const updateClampedSlide = (
        el: HTMLDivElement | null,
        frameLeft: number
      ) => {
        if (!el) return;
        const contentWidth = el.scrollWidth;
        const maxShift = Math.max(0, contentWidth - 1200);
        if (maxShift === 0) return;

        const halfVw = window.innerWidth / 2;
        const enterY = Math.max(0, frameLeft - (halfVw + 600));
        const endY = frameLeft + 600;

        const rawProgress = (curY - enterY) / (endY - enterY);
        const easedProgress = softLandingEase(rawProgress);

        const shiftX = easedProgress * maxShift;
        el.style.transform = `translate3d(${-shiftX}px, 0, 0)`;
      };

      // Frame 02 Inisial MJ (left: 1240px)
      updateClampedSlide(ddContentRef.current, 1240);

      // Frame 03 Craft (left: 2480px)
      updateClampedSlide(craftContentRef.current, 2480);

      // Frame 05 Projects (left: 4960px)
      updateClampedSlide(projectsContentRef.current, 4960);

      // Progres Minimap Ruler (0 sampai 1)
      const progress = Math.max(0, Math.min(1, curY / MAX_SCROLL_DISTANCE));
      setScrollProgress(progress);

      // Wayfinding Labels Dinamis
      let l = "";
      let r = "Enterprise Systems";
      if (curY < 620) {
        l = "";
        r = "Enterprise Systems";
      } else if (curY < 1840) {
        l = "Enterprise Systems";
        r = "Craft";
      } else if (curY < 3080) {
        l = "Craft";
        r = "Hardware Architecture";
      } else if (curY < 4340) {
        l = "Hardware Architecture";
        r = "Projects";
      } else if (curY < 5560) {
        l = "Projects";
        r = "Curriculum Vitae";
      } else if (curY < 6820) {
        l = "Curriculum Vitae";
        r = "Contact";
      } else if (curY < 8060) {
        l = "Contact";
        r = "Manifesto";
      } else {
        l = "Manifesto";
        r = "";
      }

      setLeftLabel((prev) => (prev !== l ? l : prev));
      setRightLabel((prev) => (prev !== r ? r : prev));

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onScroll = () => {
      if (!isInitialLocked.current) {
        targetScrollY.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleJumpToRatio = useCallback((ratio: number) => {
    window.scrollTo({
      top: ratio * MAX_SCROLL_DISTANCE,
      behavior: "smooth",
    });
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("masumjuniyanto06@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <CustomCursor />
      <TopBar
        progress={scrollProgress}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
        isLoaded={isLoaded}
        currentRoute="home"
        onJumpToRatio={handleJumpToRatio}
      />

      {/* GHOST CONTAINER */}
      <div className="index_ghost__Z6J_6" />

      {/* FIXED VIEWPORT STAGE */}
      <div className="index_center__dvDjE">
        <div
          ref={framesRef}
          className="index_frames__d9hw4"
          style={{ opacity: isLoaded ? 1 : 0 }}
        >

          {/* ======================================================== */}
          {/* FRAME 01 (Hero): Muhammad Ma'sum Juniyanto               */}
          {/* ======================================================== */}
          <section
            data-variant="main"
            className="index_frame p-16 flex items-center"
            style={{ left: "0px" }}
          >
            {/* Lingkaran Minimalis Deep Obsidian */}
            <div
              className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                right: "0px",
                top: "50%",
                width: "520px",
                height: "520px",
                backgroundColor: "#0F1117",
                boxShadow: "0 25px 60px -15px rgba(15, 17, 23, 0.3)",
                transformOrigin: "center center",
                transform: isLoaded
                  ? "translateY(-50%) scale(1)"
                  : "translateY(-50%) scale(0)",
                transitionDelay: "150ms",
              }}
            />

            <h1 className="relative z-10 text-[52px] leading-[1.14] font-normal tracking-tight text-neutral-900 max-w-2xl">
              {[
                { text: "Muhammad Ma'sum", offset: false },
                { text: "Juniyanto", offset: true },
                { text: "is a software engineer", offset: false },
                { text: "crafting resilient systems", offset: true },
                { text: "and tactile web interfaces", offset: false },
                { text: "based in Indonesia", offset: true },
              ].map((line, idx) => (
                <div key={idx} className="overflow-hidden block leading-[1.14]">
                  <span
                    className={`block transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      line.offset ? "ml-16" : ""
                    }`}
                    style={{
                      transform: isLoaded ? "translateY(0px)" : "translateY(100px)",
                      transitionDelay: `${250 + idx * 50}ms`,
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </h1>
          </section>

          {/* ======================================================== */}
          {/* FRAME 02 (Monogram M - J): Cyber Emerald Active State    */}
          {/* ======================================================== */}
          <Link
            data-variant="slide"
            href="/craft"
            className="index_frame group cursor-none"
            style={{ left: "1240px" }}
          >
            <span className="index_label__cgZWW">Enterprise Systems</span>

            <div
              ref={ddContentRef}
              className="index_slide_content"
            >
              <span className="text-[580px] font-black tracking-tighter leading-none text-black select-none shrink-0 h-[720px] flex items-center pl-0">
                M
              </span>
              <div
                className="shrink-0 rounded-full mx-6 transition-transform duration-500 group-hover:scale-105"
                style={{
                  width: "720px",
                  height: "720px",
                  backgroundColor: "#10B981",
                  boxShadow: "0 20px 60px rgba(16, 185, 129, 0.25)",
                }}
              />
              <span className="text-[580px] font-black tracking-tighter leading-none text-black select-none shrink-0 h-[720px] flex items-center">
                J
              </span>
            </div>
          </Link>

          {/* ======================================================== */}
          {/* FRAME 03 (Craft): Tautan Aktif Internal ke /craft         */}
          {/* ======================================================== */}
          <Link
            data-variant="slide"
            href="/craft"
            className="index_frame group cursor-none"
            style={{ left: "2480px" }}
          >
            <span className="index_label__cgZWW">Craft</span>

            <div
              ref={craftContentRef}
              className="index_slide_content"
            >
              <span
                className="text-[620px] font-black tracking-tighter leading-none text-black select-none shrink-0 h-[720px] flex items-center pl-0 group-hover:opacity-85 transition-opacity"
              >
                Craft
              </span>
            </div>
          </Link>

          {/* ======================================================== */}
          {/* FRAME 04 (IoT & Embedded Node): Pure T-Tetris PCB Collage */}
          {/* ======================================================== */}
          <Link
            data-variant="default"
            href="/craft"
            className="index_frame flex items-center justify-center group cursor-none"
            style={{ left: "3720px" }}
          >
            <span className="index_label__cgZWW">Hardware Architecture</span>

            <div className="relative flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-[1.03]">
              
              {/* CONTAINER BALOK T-TETRIS DENGAN PADDING */}
              <div
                className="relative w-[340px] h-[330px] select-none"
                style={{ filter: "drop-shadow(0 20px 40px rgba(8, 14, 44, 0.75))" }}
              >
                {/* Frame SVG Berlekuk Balok T Tetris */}
                <svg
                  viewBox="0 0 340 330"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <defs>
                    <linearGradient id="pcbFrameBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0c1238" />
                      <stop offset="100%" stopColor="#06091e" />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M 16 0
                      H 324
                      A 16 16 0 0 1 340 16
                      V 164
                      A 16 16 0 0 1 324 180
                      H 286
                      A 10 10 0 0 0 276 190
                      V 314
                      A 16 16 0 0 1 260 330
                      H 80
                      A 16 16 0 0 1 64 314
                      V 190
                      A 10 10 0 0 0 54 180
                      H 16
                      A 16 16 0 0 1 0 164
                      V 16
                      A 16 16 0 0 1 16 0
                      Z
                    "
                    fill="url(#pcbFrameBg)"
                    stroke="#23357d"
                    strokeWidth="2"
                  />

                  <path
                    d="M 24 14 H 316 V 166 H 272 V 318 H 68 V 166 H 24 Z"
                    stroke="#1d2a63"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    fill="none"
                  />
                </svg>

                {/* KONTEN KOLASE 3 PCB */}
                <div className="relative z-10 w-full h-full flex flex-col items-center">
                  
                  {/* BARIS ATAS: 2 PCB BERDAMPINGAN */}
                  <div className="w-full pt-4 px-5 flex items-center justify-between gap-3 h-[172px]">
                    
                    {/* PCB 1 (Kiri Atas): Terinspirasi Layout ESP32-S3 */}
                    <div className="relative flex-1 h-[142px] rounded-[10px] overflow-hidden border border-[#2b3c8a] bg-[#070b24] shadow-md group/card p-1">
                      <svg viewBox="0 0 144 142" fill="none" className="w-full h-full">
                        <circle cx="8" cy="8" r="4" stroke="#3b4f99" strokeWidth="1.2" fill="#040614" />
                        <circle cx="136" cy="8" r="4" stroke="#3b4f99" strokeWidth="1.2" fill="#040614" />
                        <circle cx="8" cy="134" r="4" stroke="#3b4f99" strokeWidth="1.2" fill="#040614" />

                        <rect x="42" y="8" width="94" height="36" rx="2" stroke="#4a5ea8" strokeWidth="0.8" strokeDasharray="3 2" />

                        {Array.from({ length: 10 }).map((_, i) => (
                          <g key={`s3-top-${i}`} transform={`translate(${48 + i * 9}, 14)`}>
                            <circle cx="0" cy="0" r="2.4" fill="#15803d" stroke="#22c55e" strokeWidth="0.6" />
                            <circle cx="0" cy="0" r="0.9" fill="#040614" />
                          </g>
                        ))}
                        {Array.from({ length: 10 }).map((_, i) => (
                          <g key={`s3-bot-${i}`} transform={`translate(${48 + i * 9}, 38)`}>
                            <circle cx="0" cy="0" r="2.4" fill="#15803d" stroke="#22c55e" strokeWidth="0.6" />
                            <circle cx="0" cy="0" r="0.9" fill="#040614" />
                          </g>
                        ))}

                        <circle cx="22" cy="24" r="12" stroke="#3b4f99" strokeWidth="0.8" strokeDasharray="2 2" />
                        <circle cx="16" cy="18" r="1.8" fill="#15803d" />
                        <circle cx="22" cy="18" r="1.8" fill="#15803d" />
                        <circle cx="28" cy="18" r="1.8" fill="#15803d" />
                        <circle cx="16" cy="30" r="1.8" fill="#15803d" />
                        <circle cx="22" cy="30" r="1.8" fill="#15803d" />
                        <circle cx="28" cy="30" r="1.8" fill="#15803d" />

                        <path d="M22 18 L22 10 L40 10 L48 18" stroke="#040614" strokeWidth="4" strokeLinecap="round" />
                        <path d="M22 18 L22 10 L40 10 L48 18" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

                        <path d="M66 38 L66 52 L82 68 L82 120 L96 134" stroke="#040614" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M66 38 L66 52 L82 68 L82 120 L96 134" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

                        <path d="M75 38 L75 48 L90 63 L90 116 L104 130" stroke="#040614" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M75 38 L75 48 L90 63 L90 116 L104 130" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

                        <rect x="8" y="52" width="28" height="82" rx="1.5" stroke="#4a5ea8" strokeWidth="0.8" strokeDasharray="2 2" />
                        {Array.from({ length: 4 }).map((_, i) => (
                          <g key={`s3-screw-${i}`} transform={`translate(16, ${62 + i * 20})`}>
                            <rect x="0" y="0" width="12" height="12" rx="1" fill="#040614" stroke="#3b4f99" strokeWidth="0.6" />
                            <circle cx="6" cy="6" r="3.8" stroke="#7084d6" strokeWidth="0.7" fill="#0a0f30" />
                            <line x1="3.5" y1="3.5" x2="8.5" y2="8.5" stroke="#7084d6" strokeWidth="0.8" />
                            <circle cx="16" cy="6" r="1.6" fill="#15803d" />
                          </g>
                        ))}

                        <circle cx="56" cy="26" r="1.8" fill="#38bdf8" className="animate-ping opacity-75" />
                        <circle cx="56" cy="26" r="1.4" fill="#0284c7" />
                      </svg>
                    </div>

                    {/* PCB 2 (Kanan Atas): Terinspirasi Layout ESP32-CAM */}
                    <div className="relative flex-1 h-[142px] rounded-[10px] overflow-hidden border border-[#2b3c8a] bg-[#070b24] shadow-md group/card p-1">
                      <svg viewBox="0 0 144 142" fill="none" className="w-full h-full">
                        <rect x="52" y="6" width="40" height="22" rx="1" stroke="#4a5ea8" strokeWidth="0.8" />
                        <g transform="translate(62, 17)">
                          <circle cx="0" cy="0" r="5" stroke="#7084d6" strokeWidth="0.8" fill="#0a0f30" />
                          <line x1="-3" y1="-3" x2="3" y2="3" stroke="#7084d6" strokeWidth="0.8" />
                          <circle cx="0" cy="0" r="1.8" fill="#15803d" />
                        </g>
                        <g transform="translate(82, 17)">
                          <circle cx="0" cy="0" r="5" stroke="#7084d6" strokeWidth="0.8" fill="#0a0f30" />
                          <line x1="-3" y1="-3" x2="3" y2="3" stroke="#7084d6" strokeWidth="0.8" />
                          <circle cx="0" cy="0" r="1.8" fill="#15803d" />
                        </g>

                        <rect x="14" y="32" width="116" height="102" rx="2" stroke="#4a5ea8" strokeWidth="0.9" />

                        <circle cx="72" cy="56" r="12" stroke="#7084d6" strokeWidth="1.4" fill="none" />
                        <circle cx="72" cy="56" r="6" stroke="#2b3c8a" strokeWidth="0.8" fill="#040614" />

                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={`cam-pin-l-${i}`} transform={`translate(24, ${46 + i * 11})`}>
                            <circle cx="0" cy="0" r="2.5" fill="#15803d" stroke="#22c55e" strokeWidth="0.6" />
                            <circle cx="0" cy="0" r="0.9" fill="#040614" />
                          </g>
                        ))}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={`cam-pin-r-${i}`} transform={`translate(120, ${46 + i * 11})`}>
                            <circle cx="0" cy="0" r="2.5" fill="#15803d" stroke="#22c55e" strokeWidth="0.6" />
                            <circle cx="0" cy="0" r="0.9" fill="#040614" />
                          </g>
                        ))}

                        <path d="M62 24 L62 34 L36 60 L24 60" stroke="#040614" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M62 24 L62 34 L36 60 L24 60" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

                        <path d="M82 24 L82 30 L48 64 L34 64 L24 74" stroke="#040614" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M82 24 L82 30 L48 64 L34 64 L24 74" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

                        <rect x="58" y="94" width="28" height="20" rx="1.5" stroke="#3b4f99" strokeWidth="0.8" fill="#040614" />
                        <circle cx="72" cy="104" r="2" fill="#15803d" />
                      </svg>
                    </div>

                  </div>

                  {/* BARIS BAWAH: 1 PCB DI TENGAH */}
                  <div className="w-[196px] h-[132px] pt-2 flex flex-col items-center justify-center">
                    <div className="relative w-full h-[116px] rounded-[10px] overflow-hidden border border-[#2b3c8a] bg-[#070b24] shadow-md group/card p-1">
                      <svg viewBox="0 0 196 116" fill="none" className="w-full h-full">
                        <circle cx="8" cy="8" r="3.5" stroke="#3b4f99" strokeWidth="1" fill="#040614" />
                        <circle cx="188" cy="8" r="3.5" stroke="#3b4f99" strokeWidth="1" fill="#040614" />
                        <circle cx="8" cy="108" r="3.5" stroke="#3b4f99" strokeWidth="1" fill="#040614" />
                        <circle cx="188" cy="108" r="3.5" stroke="#3b4f99" strokeWidth="1" fill="#040614" />

                        {Array.from({ length: 14 }).map((_, i) => (
                          <g key={`terra-top-${i}`} transform={`translate(${72 + i * 7.5}, 10)`}>
                            <circle cx="0" cy="0" r="1.9" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="0.7" fill="#040614" />
                          </g>
                        ))}
                        {Array.from({ length: 14 }).map((_, i) => (
                          <g key={`terra-bot-${i}`} transform={`translate(${72 + i * 7.5}, 104)`}>
                            <circle cx="0" cy="0" r="1.9" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="0.7" fill="#040614" />
                          </g>
                        ))}

                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={`terra-rt-${i}`} transform={`translate(182, ${24 + i * 9.5})`}>
                            <circle cx="0" cy="0" r="1.9" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="0.7" fill="#040614" />
                          </g>
                        ))}

                        <rect x="22" y="22" width="18" height="66" rx="1" stroke="#4a5ea8" strokeWidth="0.7" strokeDasharray="2 2" />
                        {Array.from({ length: 4 }).map((_, i) => (
                          <g key={`terra-relay-${i}`} transform={`translate(31, ${32 + i * 15})`}>
                            <circle cx="0" cy="0" r="3.5" stroke="#7084d6" strokeWidth="0.6" fill="#0a0f30" />
                            <line x1="-2" y1="-2" x2="2" y2="2" stroke="#7084d6" strokeWidth="0.7" />
                            <circle cx="0" cy="0" r="1.2" fill="#15803d" />
                          </g>
                        ))}

                        {Array.from({ length: 4 }).map((_, i) => (
                          <g key={`terra-mid-${i}`} transform={`translate(74, ${44 + i * 9})`}>
                            <circle cx="0" cy="0" r="1.9" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="0.7" fill="#040614" />
                          </g>
                        ))}

                        <path d="M12 28 L30 28 L56 54 L74 54" stroke="#040614" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 28 L30 28 L56 54 L74 54" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                        <path d="M74 62 L94 62 L120 88 L154 88" stroke="#040614" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M74 62 L94 62 L120 88 L154 88" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                        <path d="M74 44 L90 44 L114 20 L140 20" stroke="#040614" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M74 44 L90 44 L114 20 L140 20" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

                        <g transform="translate(136, 42)">
                          <path
                            d="M6 24 C6 17 14 12 18 5 C20 12 17 20 10 24 Z"
                            fill="#7084d6"
                            opacity="0.8"
                          />
                          <path
                            d="M10 22 C13 18 20 17 24 12 C24 17 20 22 14 24 Z"
                            fill="#7084d6"
                            opacity="0.8"
                          />
                          <circle cx="10" cy="28" r="1.5" fill="#7084d6" opacity="0.8" />
                        </g>
                      </svg>
                    </div>
                  </div>

                </div>
              </div>

              {/* LABEL STATUS */}
              <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PCB Hardware Architecture
              </div>
            </div>
          </Link>

          {/* ======================================================== */}
          {/* FRAME 05 (Projects): Tautan Aktif Internal ke /projects   */}
          {/* ======================================================== */}
          <Link
            data-variant="slide"
            href="/projects"
            className="index_frame group cursor-none"
            style={{ left: "4960px" }}
          >
            <span className="index_label__cgZWW">Projects</span>

            <div
              ref={projectsContentRef}
              className="index_slide_content"
            >
              <span
                className="text-[620px] font-black tracking-tighter leading-none text-black select-none shrink-0 h-[720px] flex items-center pl-0 group-hover:opacity-85 transition-opacity"
              >
                Projects
              </span>
            </div>
          </Link>

          {/* ======================================================== */}
          {/* FRAME 06 (Resume / CV): Direct Google Drive Document     */}
          {/* ======================================================== */}
          <a
            data-variant="default"
            href="https://drive.google.com/file/d/1Ec-WIm0uWnI0MDkfuv2DDbNJLUadeAG5/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="index_frame flex items-center justify-center group cursor-none"
            style={{ left: "6200px" }}
          >
            <span className="index_label__cgZWW">Curriculum Vitae</span>
            <span
              className="font-script text-[96px] tracking-wide -rotate-2 select-none text-[#0F1117] transition-all duration-300 group-hover:scale-105 group-hover:text-[#10B981]"
            >
              Ma&apos;sum&apos;s Resume
            </span>
          </a>

          {/* ======================================================== */}
          {/* FRAME 07 (Contact): Professional Social & Email Copy     */}
          {/* ======================================================== */}
          <div
            data-variant="default"
            className="index_frame p-16 flex flex-col justify-between"
            style={{ left: "7440px" }}
          >
            <div className="flex justify-between items-center text-2xl font-normal">
              <a
                data-position="top-left"
                href="https://linkedin.com/in/muhammad-ma-sum-juniyanto-91077b335"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity cursor-none"
              >
                LinkedIn
              </a>
              <span
                data-position="top-right"
                className="font-mono text-neutral-500 text-lg cursor-none select-none"
              >
                2026
              </span>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                aria-label="Copy email"
                onClick={handleCopyEmail}
                className="relative grid grid-cols-1 grid-rows-1 h-16 overflow-hidden text-5xl font-normal tracking-tight hover:opacity-60 transition-opacity active:scale-95 cursor-none select-none"
              >
                <span
                  className="col-start-1 row-start-1 flex items-center justify-center transition-all duration-300 ease-out text-black leading-none m-0 p-0"
                  style={{
                    transform: copied ? "translateY(-100%)" : "translateY(0%)",
                    opacity: copied ? 0 : 1,
                  }}
                >
                  Email
                </span>
                <span
                  aria-live="polite"
                  className="col-start-1 row-start-1 flex items-center justify-center transition-all duration-300 ease-out text-neutral-500 leading-none m-0 p-0"
                  style={{
                    transform: copied ? "translateY(0%)" : "translateY(100%)",
                    opacity: copied ? 1 : 0,
                  }}
                >
                  Copied
                </span>
              </button>
            </div>

            <div className="flex justify-between items-center text-2xl font-normal">
              <span
                data-position="bottom-left"
                className="font-mono text-neutral-500 text-lg cursor-none select-none"
              >
                2022
              </span>
              <a
                data-position="bottom-right"
                href="https://github.com/masumjn"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity cursor-none"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FRAME 08 (Manifesto): Systems Architect Dark Canvas      */}
          {/* ======================================================== */}
          <div
            data-variant="default"
            className="index_frame p-24 flex flex-col justify-center transition-colors duration-500"
            style={{
              left: "8680px",
              backgroundColor: "#0F1117",
              borderColor: "#1E293B",
            }}
          >
            <div className="text-[52px] font-bold tracking-tight text-[#F8FAFC] leading-[1.18] select-none">
              Build it resilient.<br />
              Secure every tier.<br />
              Optimize latency.<br />
              Bridge hardware &amp; software.<br />
              Make it impactful.<br />
              <span className="text-[#10B981]">Make it.</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}