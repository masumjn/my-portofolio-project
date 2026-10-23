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
        r = "IoT & Hardware";
      } else if (curY < 4340) {
        l = "IoT & Hardware";
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
            <div
              className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                right: "0px",
                top: "50%",
                width: "520px",
                height: "520px",
                backgroundColor: "var(--yellow)",
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
          {/* FRAME 02 (Monogram M - J): Enterprise Systems Slide      */}
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
                className="shrink-0 rounded-full mx-6"
                style={{
                  width: "720px",
                  height: "720px",
                  backgroundColor: "var(--orange)",
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
          {/* FRAME 04 (IoT & Embedded Node): Custom ESP32-S3 PCB      */}
          {/* ======================================================== */}
          <Link
            data-variant="default"
            href="/craft"
            className="index_frame flex items-center justify-center group cursor-none"
            style={{ left: "3720px" }}
          >
            <span className="index_label__cgZWW">IoT &amp; Hardware Prototype</span>

            {/* PCB BOARD WIDGET */}
            <div className="relative flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-[1.03]">
              <div className="relative w-[300px] h-[340px] rounded-[14px] bg-[#0c1236] border-2 border-[#1e2a6b] shadow-2xl overflow-hidden p-3 select-none">
                
                {/* SVG Skematik Layout PCB ESP32-S3 */}
                <svg
                  viewBox="0 0 300 340"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Lubang Baut Sudut PCB (Mounting Holes) */}
                  <circle cx="16" cy="16" r="6" stroke="#4355a4" strokeWidth="2" fill="#06091e" />
                  <circle cx="284" cy="16" r="6" stroke="#4355a4" strokeWidth="2" fill="#06091e" />
                  <circle cx="16" cy="324" r="6" stroke="#4355a4" strokeWidth="2" fill="#06091e" />
                  <circle cx="284" cy="324" r="6" stroke="#4355a4" strokeWidth="2" fill="#06091e" />

                  {/* Silkscreen Batas Modul ESP32-S3 */}
                  <rect x="92" y="16" width="176" height="74" rx="3" stroke="#6b7ec9" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x="274" y="24" fill="#889ce8" fontSize="6" fontFamily="monospace" transform="rotate(90 274 24)">
                    ESP32-S3-DEVKITC-1-N8R2
                  </text>

                  {/* Pin Header ESP32 Baris Atas */}
                  {Array.from({ length: 18 }).map((_, i) => (
                    <g key={`pin-top-${i}`} transform={`translate(${98 + i * 9.2}, 24)`}>
                      <circle cx="0" cy="0" r="2.8" fill="#16a34a" stroke="#22c55e" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="1.1" fill="#050814" />
                    </g>
                  ))}

                  {/* Pin Header ESP32 Baris Bawah */}
                  {Array.from({ length: 18 }).map((_, i) => (
                    <g key={`pin-bot-${i}`} transform={`translate(${98 + i * 9.2}, 82)`}>
                      <circle cx="0" cy="0" r="2.8" fill="#16a34a" stroke="#22c55e" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="1.1" fill="#050814" />
                    </g>
                  ))}

                  {/* Header I2S / Sensor Audio Bulat (Kiri Atas) */}
                  <circle cx="44" cy="48" r="18" stroke="#4355a4" strokeWidth="1" strokeDasharray="2 2" fill="none" />
                  <text x="32" y="44" fill="#7182cc" fontSize="5" fontFamily="monospace">GND VDD SD</text>
                  <text x="32" y="58" fill="#7182cc" fontSize="5" fontFamily="monospace">L/R WS SCK</text>
                  <circle cx="36" cy="36" r="2.2" fill="#16a34a" />
                  <circle cx="44" cy="36" r="2.2" fill="#16a34a" />
                  <circle cx="52" cy="36" r="2.2" fill="#16a34a" />
                  <circle cx="36" cy="62" r="2.2" fill="#16a34a" />
                  <circle cx="44" cy="62" r="2.2" fill="#16a34a" />
                  <circle cx="52" cy="62" r="2.2" fill="#16a34a" />

                  {/* Jalur Tembaga / PCB Traces (Khas Sudut 45 Derajat) */}
                  <path d="M44 36 L44 26 L80 26 L92 38 L98 38" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M52 36 L52 30 L82 30 L94 42 L98 42" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M44 62 L74 62 L90 74 L98 74" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M52 62 L78 62 L94 78 L98 78" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M125 82 L125 106 L154 135 L154 286 L180 312 L196 312" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M134 82 L134 102 L162 130 L162 280 L186 304 L204 304" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M236 298 L248 310 L260 310" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M246 290 L256 300 L268 300" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Blok Relay 4-Channel (Sisi Kiri) */}
                  <rect x="18" y="104" width="76" height="216" rx="2" stroke="#6b7ec9" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x="32" y="332" fill="#889ce8" fontSize="6.5" fontFamily="monospace">RELAY-4-SRD</text>

                  {/* Terminal Screw Relay */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <g key={`relay-term-${i}`} transform={`translate(26, ${116 + i * 25})`}>
                      <rect x="0" y="0" width="22" height="18" rx="2" fill="#080d28" stroke="#4355a4" strokeWidth="1" />
                      <circle cx="11" cy="9" r="6" stroke="#889ce8" strokeWidth="1" fill="#0e1744" />
                      <line x1="7" y1="5" x2="15" y2="13" stroke="#889ce8" strokeWidth="1.2" />
                      <circle cx="28" cy="9" r="2.2" fill="#16a34a" stroke="#22c55e" strokeWidth="0.8" />
                      <circle cx="28" cy="9" r="0.9" fill="#050814" />
                    </g>
                  ))}

                  {/* Header Konektor Tengah (Jumper / Sensor Header) */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <g key={`mid-hdr-${i}`} transform={`translate(154, ${118 + i * 10})`}>
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" stroke="#4355a4" strokeWidth="0.8" fill="#0c1236" />
                      <circle cx="0" cy="0" r="2.8" fill="#16a34a" stroke="#22c55e" strokeWidth="0.8" />
                      <circle cx="0" cy="0" r="1.1" fill="#050814" />
                    </g>
                  ))}

                  {/* Modul Step-Down LM2596 (Kanan Bawah) */}
                  <rect x="228" y="160" width="58" height="68" rx="2" stroke="#6b7ec9" strokeWidth="1.2" strokeDasharray="3 2" />
                  <text x="282" y="166" fill="#889ce8" fontSize="5.5" fontFamily="monospace" transform="rotate(90 282 166)">
                    DC-DC-LM2596-DISP
                  </text>
                  <circle cx="266" cy="144" r="7" stroke="#4355a4" strokeWidth="1" />
                  <circle cx="266" cy="244" r="7" stroke="#4355a4" strokeWidth="1" />

                  {/* Terminal Blok Daya: OUT & IN (Bawah Kanan) */}
                  {/* OUT */}
                  <g transform="translate(176, 290)">
                    <rect x="0" y="0" width="38" height="34" rx="2" stroke="#6b7ec9" strokeWidth="1.2" />
                    <text x="12" y="-4" fill="#889ce8" fontSize="6.5" fontFamily="monospace">OUT</text>
                    <g transform="translate(10, 16)">
                      <circle cx="0" cy="0" r="6" stroke="#889ce8" strokeWidth="1" fill="#0e1744" />
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#889ce8" strokeWidth="1.2" />
                      <text x="-3" y="12" fill="#22c55e" fontSize="7" fontWeight="bold">-</text>
                    </g>
                    <g transform="translate(28, 16)">
                      <circle cx="0" cy="0" r="6" stroke="#889ce8" strokeWidth="1" fill="#0e1744" />
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#889ce8" strokeWidth="1.2" />
                      <text x="-3" y="12" fill="#ef4444" fontSize="7" fontWeight="bold">+</text>
                    </g>
                  </g>

                  {/* IN */}
                  <g transform="translate(242, 290)">
                    <rect x="0" y="0" width="38" height="34" rx="2" stroke="#6b7ec9" strokeWidth="1.2" />
                    <text x="14" y="-4" fill="#889ce8" fontSize="6.5" fontFamily="monospace">IN</text>
                    <g transform="translate(10, 16)">
                      <circle cx="0" cy="0" r="6" stroke="#889ce8" strokeWidth="1" fill="#0e1744" />
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#889ce8" strokeWidth="1.2" />
                      <text x="-3" y="12" fill="#ef4444" fontSize="7" fontWeight="bold">+</text>
                    </g>
                    <g transform="translate(28, 16)">
                      <circle cx="0" cy="0" r="6" stroke="#889ce8" strokeWidth="1" fill="#0e1744" />
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#889ce8" strokeWidth="1.2" />
                      <text x="-3" y="12" fill="#22c55e" fontSize="7" fontWeight="bold">-</text>
                    </g>
                  </g>

                  {/* Status Indicator LED (Blinking Pulse) */}
                  <g transform="translate(106, 44)">
                    <circle cx="0" cy="0" r="2.5" fill="#38bdf8" className="animate-ping opacity-75" />
                    <circle cx="0" cy="0" r="2" fill="#0284c7" />
                  </g>
                  <g transform="translate(106, 60)">
                    <circle cx="0" cy="0" r="2.5" fill="#22c55e" className="animate-pulse" />
                    <circle cx="0" cy="0" r="1.8" fill="#16a34a" />
                  </g>
                </svg>
              </div>

              {/* Label Keterangan Hardware */}
              <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ESP32-S3 · Relay &amp; Power Architecture
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
              className="font-script text-[96px] tracking-wide -rotate-2 select-none group-hover:scale-105 transition-transform"
              style={{ color: "var(--colors-red)" }}
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
          {/* FRAME 08 (Manifesto): Resilient Engineering Principles   */}
          {/* ======================================================== */}
          <div
            data-variant="default"
            className="index_frame p-24 flex flex-col justify-center"
            style={{
              left: "8680px",
              backgroundColor: "var(--yellow)",
              borderColor: "#111111",
            }}
          >
            <div className="text-[52px] font-bold tracking-tight text-black leading-[1.18] select-none">
              Build it resilient.<br />
              Secure every tier.<br />
              Optimize latency.<br />
              Bridge hardware &amp; software.<br />
              Make it impactful.<br />
              Make it.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}