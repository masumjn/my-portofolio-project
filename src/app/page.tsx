"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import TopBar from "@/components/TopBar";
import PixelHand from "@/components/PixelHand";

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
  const [rightLabel, setRightLabel] = useState("Devouring Details");
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
      // Abaikan jika fokus sedang berada pada form/input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const STEP = 480; // Jarak langkah per ketukan tombol panah

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
      // Jika mendeteksi scroll/swipe horizontal dari trackpad (deltaX dominan)
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

      // Frame 02 DD (left: 1240px)
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
      let r = "Devouring Details";
      if (curY < 620) {
        l = "";
        r = "Devouring Details";
      } else if (curY < 1840) {
        l = "Devouring Details";
        r = "Craft";
      } else if (curY < 3080) {
        l = "Craft";
        r = "History of Software Design";
      } else if (curY < 4340) {
        l = "History of Software Design";
        r = "Projects";
      } else if (curY < 5560) {
        l = "Projects";
        r = "Field Notes";
      } else if (curY < 6820) {
        l = "Field Notes";
        r = "Twitter";
      } else if (curY < 8060) {
        l = "Twitter";
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
    navigator.clipboard.writeText("rauno@freiberg.ee");
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
          {/* FRAME 01 (Hero): Stagger Reveal & Expanding Yellow Circle */}
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
                { text: "Rauno Freiberg", offset: false },
                { text: "is an Estonian", offset: true },
                { text: "interaction", offset: false },
                { text: "designer", offset: true },
                { text: "working with Vercel", offset: false },
                { text: "and Devouring Details", offset: true },
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
          {/* FRAME 02 (DD): Early Clamped Slide                       */}
          {/* ======================================================== */}
          <a
            data-variant="slide"
            href="https://www.devouringdetails.com"
            target="_blank"
            rel="noreferrer"
            className="index_frame group cursor-none"
            style={{ left: "1240px" }}
          >
            <span className="index_label__cgZWW">Devouring Details</span>

            <div
              ref={ddContentRef}
              className="index_slide_content"
            >
              <span className="text-[580px] font-black tracking-tighter leading-none text-black select-none shrink-0 h-[720px] flex items-center pl-0">
                D
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
                D
              </span>
            </div>
          </a>

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
          {/* FRAME 04 (Retro Hand): left: 3720px                      */}
          {/* ======================================================== */}
          <a
            data-variant="default"
            href="https://historyofsoftware.org"
            target="_blank"
            rel="noreferrer"
            className="index_frame flex items-center justify-center group cursor-none"
            style={{ left: "3720px" }}
          >
            <span className="index_label__cgZWW">History of Software Design</span>
            <PixelHand />
          </a>

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
          {/* FRAME 06 (Notes): left: 6200px                           */}
          {/* ======================================================== */}
          <a
            data-variant="default"
            href="https://rauno.me/notes"
            target="_blank"
            rel="noreferrer"
            className="index_frame flex items-center justify-center group cursor-none"
            style={{ left: "6200px" }}
          >
            <span className="index_label__cgZWW">Field Notes</span>
            <span
              className="font-script text-[96px] tracking-wide -rotate-2 select-none"
              style={{ color: "var(--colors-red)" }}
            >
              Rauno&apos;s Field Notes
            </span>
          </a>

          {/* ======================================================== */}
          {/* FRAME 07 (Contact): In-Place Baseline Swap Copy Email     */}
          {/* ======================================================== */}
          <div
            data-variant="default"
            className="index_frame p-16 flex flex-col justify-between"
            style={{ left: "7440px" }}
          >
            <div className="flex justify-between items-center text-2xl font-normal">
              <a
                data-position="top-left"
                href="https://x.com/raunofreiberg"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity cursor-none"
              >
                Twitter
              </a>
              <a
                data-position="top-right"
                href="https://2023.rauno.me"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity font-mono text-neutral-500 text-lg cursor-none"
              >
                2023
              </a>
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
              <a
                data-position="bottom-left"
                href="https://2022.rauno.me"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity font-mono text-neutral-500 text-lg cursor-none"
              >
                2022
              </a>
              <a
                data-position="bottom-right"
                href="https://github.com/raunofreiberg"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-50 transition-opacity cursor-none"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FRAME 08 (Manifesto): left: 8680px                       */}
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
              Make it fast.<br />
              Make it beautiful.<br />
              Make it consistent.<br />
              Make it carefully.<br />
              Make it timeless.<br />
              Make it soulful.<br />
              Make it.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}