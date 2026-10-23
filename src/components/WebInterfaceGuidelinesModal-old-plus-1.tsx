"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export default function WebInterfaceGuidelinesModal({
  isOpen,
  title,
  onClose,
}: ModalProps) {
  const [isClosing, setIsClosing] = React.useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<HTMLDivElement>(null);

  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);

  // Pecah judul menjadi array kata untuk memetakan level kedalaman / filter blur dinamis
  const words = title ? title.trim().split(" ") : ["Web", "Interface", "Guidelines"];

  // 1. Kunci Scroll Body & Reset Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
      targetScrollY.current = 0;
      currentScrollY.current = 0;

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // 2. Parallax Garis Blueprint
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const render = () => {
      const diff = targetScrollY.current - currentScrollY.current;
      if (Math.abs(diff) < 0.08) {
        currentScrollY.current = targetScrollY.current;
      } else {
        currentScrollY.current += diff * 0.08;
      }

      // Parallax mikro untuk garis horizontal
      if (titleLinesRef.current) {
        titleLinesRef.current.style.transform = `translate3d(0, ${-currentScrollY.current * 0.15}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onScroll = () => {
      if (scrollContainerRef.current) {
        targetScrollY.current = scrollContainerRef.current.scrollTop;
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", onScroll);
      }
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  // 3. Animasi Keluar
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 280);
  }, [isClosing, onClose]);

  // 4. Deteksi Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isClosing) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isClosing, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes sheetSlideUp {
          0% { transform: translate3d(0, 100%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes sheetSlideDown {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, 100%, 0); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes headerFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes headerFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .modal-sheet-enter { animation: sheetSlideUp 380ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .modal-sheet-exit { animation: sheetSlideDown 280ms cubic-bezier(0.3, 0, 0.8, 0.15) forwards; }
        .modal-backdrop-enter { animation: backdropFadeIn 380ms ease-out forwards; }
        .modal-backdrop-exit { animation: backdropFadeOut 280ms ease-out forwards; }
        .modal-header-enter { animation: headerFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards; pointer-events: auto; }
        .modal-header-exit { animation: headerFadeOut 220ms cubic-bezier(0.4, 0, 1, 1) forwards; pointer-events: none !important; }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-0 z-[9999] overflow-hidden cursor-none select-none"
      >
        {/* BACKDROP DIMMER */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-sm ${
            isClosing ? "modal-backdrop-exit" : "modal-backdrop-enter"
          }`}
          onClick={handleClose}
        />

        {/* FULL-BLEED MODAL SHEET */}
        <div
          ref={scrollContainerRef}
          className={`fixed inset-0 w-screen h-screen bg-white overflow-y-auto overflow-x-hidden cursor-none will-change-transform ${
            isClosing ? "modal-sheet-exit" : "modal-sheet-enter"
          }`}
        >
          {/* HEADER BAR */}
          <header
            className={`sticky top-0 left-0 w-full h-14 bg-[rgba(18,18,18,0.78)] backdrop-blur-xl border-b border-white/[0.08] z-[1000] flex items-center justify-between will-change-[opacity] ${
              isClosing ? "modal-header-exit" : "modal-header-enter"
            }`}
          >
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center h-full px-6 font-mono text-xs uppercase tracking-widest text-white/75 hover:text-white transition-colors cursor-none select-none"
            >
              ← Close (Esc)
            </button>

            <button
              type="button"
              aria-label="Close document"
              onClick={handleClose}
              className="w-14 h-14 bg-black/90 hover:bg-black active:bg-neutral-900 border-l border-white/[0.08] flex items-center justify-center transition-colors cursor-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* SISI GRADIENT SAMPING */}
          <div aria-hidden="true" className="hidden md:block fixed top-0 bottom-0 pointer-events-none z-[3]" style={{ left: 0, width: "calc(50% - 460px)", background: "linear-gradient(to right, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0))" }} />
          <div aria-hidden="true" className="hidden md:block fixed top-0 bottom-0 pointer-events-none z-[3]" style={{ right: 0, width: "calc(50% - 460px)", background: "linear-gradient(to left, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0))" }} />

          {/* WADAH UTAMA MODAL (Curtain Overlap) */}
          <div className="relative w-full min-h-[1400px] px-6 md:px-12 flex flex-col items-center bg-white cursor-none">
            
            {/* Garis Vertikal Blueprint */}
            <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 w-[1px] pointer-events-none z-[1]" style={{ left: "calc(50% - 460px)", height: "100%", minHeight: "100vh", backgroundColor: "rgba(0, 220, 255, 0.35)" }} />
            <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 w-[1px] pointer-events-none z-[1]" style={{ right: "calc(50% - 460px)", height: "100%", minHeight: "100vh", backgroundColor: "rgba(0, 220, 255, 0.35)" }} />

            {/* WADAH JUDUL STICKY (Lapisan Belakang z-index: 1 - Statis tertimpa konten) */}
            <div
              className="sticky top-14 w-full max-w-[840px] pt-12 pb-8 z-[1] select-none pointer-events-none opacity-100"
              style={{ "--lh": "78px", "--offset": "10px" } as React.CSSProperties}
            >
              {/* Garis Horizontal Blueprint Tergenerasi Dinamis */}
              <div ref={titleLinesRef} className="absolute inset-0 pointer-events-none will-change-transform">
                {words.map((_, i) => (
                  <React.Fragment key={i}>
                    <div
                      className="absolute left-[-200vw] w-[500vw] h-[1px]"
                      style={{ top: `calc(var(--lh) * ${i} + var(--offset))`, backgroundColor: "rgba(0, 220, 255, 0.55)" }}
                    />
                    <div
                      className="absolute left-[-200vw] w-[500vw] h-[1px]"
                      style={{ top: `calc(var(--lh) * ${i + 1} - var(--offset) * 2 + 1px)`, backgroundColor: "rgba(0, 220, 255, 0.22)" }}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Teks Judul H1 Dinamis (font-bold 700 & tracking-[-0.035em]) */}
              <h1 className="relative font-bold tracking-[-0.035em] text-[70px] leading-[78px] text-black">
                {words.map((word, i) => {
                  let blur = "none";
                  let opacity = 1.0;
                  let color = "#000000";

                  if (words.length > 1) {
                    if (i === 0) { // Kata Pertama (Deep Plane)
                      blur = "blur(1.1px)";
                      opacity = 0.58;
                      color = "#3a3a3a";
                    } else if (i === words.length - 1) { // Kata Terakhir (Sharp Plane)
                      blur = "none";
                      opacity = 1.0;
                      color = "#000000";
                    } else { // Kata Tengah (Mid Plane)
                      blur = "blur(0.45px)";
                      opacity = 0.82;
                      color = "#222222";
                    }
                  }

                  return (
                    <span
                      key={i}
                      className="block select-none font-bold"
                      style={{ filter: blur, opacity, color }}
                    >
                      {word}
                    </span>
                  );
                })}
              </h1>
            </div>

            {/* TIRAI KONTEN DOKUMEN PUTIH SOLID (Lapisan Depan z-index: 2) */}
            {/* Bebas dari properti translateZ() dan efek blur turunan apa pun */}
            <div
              className="relative z-[2] w-full max-w-[840px] pt-12 pb-44 px-12 md:px-14 leading-relaxed font-sans bg-white"
              style={{
                boxShadow: "0 -16px 32px -8px rgba(0, 0, 0, 0.04)",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* INTRODUCTION (100% Bersih) */}
              <div className="space-y-4 text-[15px] text-neutral-700 mb-14">
                <h2 className="flex items-center gap-2.5 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Introduction
                </h2>
                <p>
                  This document outlines a non-exhaustive list of details that make a good (web) interface.
                  It is a living document, periodically updated based on learnings. Some of these may be subjective,
                  but most apply to all websites.
                </p>
                <p>
                  The{" "}
                  <a href="https://www.w3.org/TR/wai-aria-1.1/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-black hover:opacity-70 cursor-none">
                    WAI-ARIA
                  </a>{" "}
                  spec is deliberately not duplicated in this document. However, some accessibility guidelines may be pointed out.
                  Contributions are welcome. Edit{" "}
                  <a href="https://github.com/raunofreiberg/interfaces/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-black hover:opacity-70 cursor-none">
                    this file
                  </a>{" "}
                  and submit a pull request.
                </p>
              </div>

              {/* 1. INTERACTIVITY */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path clipRule="evenodd" d="M19.503 9.97c1.204.489 1.112 2.224-.137 2.583l-6.306 1.813-2.88 5.895c-.57 1.168-2.295.957-2.568-.314L4.677 6.257A1.369 1.369 0 016.53 4.7L19.503 9.97z" />
                  </svg>
                  Interactivity
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Clicking the input label should focus the input field</li>
                  <li>Inputs should be wrapped with a <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">&lt;form&gt;</code> to submit by pressing Enter</li>
                  <li>Inputs should have an appropriate <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">type</code> like password, email, etc</li>
                  <li>Inputs should disable spellcheck and autocomplete attributes most of the time</li>
                  <li>Inputs should leverage HTML form validation by using the required attribute when appropriate</li>
                  <li>Input prefix and suffix decorations, such as icons, should be absolutely positioned on top of the text input with padding, not next to it, and trigger focus on the input</li>
                  <li>Toggles should immediately take effect, not require confirmation</li>
                  <li>Buttons should be disabled after submission to avoid duplicate network requests</li>
                  <li>Interactive elements should disable user-select for inner content</li>
                  <li>Decorative elements (glows, gradients) should disable pointer-events to not hijack events</li>
                  <li>Interactive elements in a vertical or horizontal list should have no dead areas between each element, instead, increase their padding</li>
                </ul>
              </section>

              {/* 2. TYPOGRAPHY */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 7V5H5v2M12 5v14m0 0h-2m2 0h2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Typography
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Fonts should have <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">-webkit-font-smoothing: antialiased</code> applied for better legibility</li>
                  <li>Fonts should have <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">text-rendering: optimizeLegibility</code> applied for better legibility</li>
                  <li>Fonts should be subset based on the content, alphabet or relevant language(s)</li>
                  <li>Font weight should not change on hover or selected state to prevent layout shift</li>
                  <li>Font weights below 400 should not be used</li>
                  <li>Medium sized headings generally look best with a font weight between 500-600</li>
                  <li>Adjust values fluidly by using CSS <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">clamp()</code>, e.g. <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">clamp(48px, 5vw, 72px)</code></li>
                  <li>Where available, tabular figures should be applied with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">font-variant-numeric: tabular-nums</code></li>
                  <li>Prevent text resizing unexpectedly in landscape mode on iOS with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">-webkit-text-size-adjust: 100%</code></li>
                </ul>
              </section>

              {/* 3. MOTION */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M13.848 13.317L9.505 18.28a2 2 0 01-3.01 0l-4.343-4.963a2 2 0 010-2.634L6.495 5.72a2 2 0 013.01 0l4.343 4.963a2 2 0 010 2.634z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 19l4.884-5.698a2 2 0 000-2.604L13 5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17 19l4.884-5.698a2 2 0 000-2.604L17 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Motion
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Switching themes should not trigger transitions and animations on elements <sup>1</sup></li>
                  <li>Animation duration should not be more than 200ms for interactions to feel immediate</li>
                  <li>Animation values should be proportional to the trigger size (don&apos;t animate dialog scale from 0 → 1, fade opacity and scale from ~0.8)</li>
                  <li>Actions that are frequent and low in novelty should avoid extraneous animations <sup>2</sup></li>
                  <li>Looping animations should pause when not visible on the screen to offload CPU and GPU usage</li>
                  <li>Use <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">scroll-behavior: smooth</code> for navigating to in-page anchors with an appropriate offset</li>
                </ul>
              </section>

              {/* 4. TOUCH */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7.5 12l-2.004 2.672a2 2 0 00.126 2.552l3.784 4.128c.378.413.912.648 1.473.648H15.5c2.4 0 4-2 4-4 0 0 0 0 0 0V9.429M16.5 10v-.571c0-2.286 3-2.286 3 0" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.5 10V8.286c0-2.286 3-2.286 3 0V10M10.5 10V7.5c0-2.286 3-2.286 3 0 0 0 0 0 0 0V10M10.5 10V7.5 3.499A1.5 1.5 0 009 2v0a1.5 1.5 0 00-1.5 1.5V15" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Touch
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Hover states should not be visible on touch press, use <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">@media (hover: hover)</code> <sup>3</sup></li>
                  <li>Font size for inputs should not be smaller than 16px to prevent iOS zooming on focus</li>
                  <li>Inputs should not auto focus on touch devices as it will open the keyboard and cover the screen</li>
                  <li>Apply <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">muted</code> and <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">playsinline</code> to video tags to auto play on iOS</li>
                  <li>Disable touch-action for custom components that implement pan and zoom gestures</li>
                  <li>Disable default iOS tap highlight with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">-webkit-tap-highlight-color: rgba(0,0,0,0)</code></li>
                </ul>
              </section>

              {/* 5. OPTIMIZATIONS */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 12h3l3-9 6 18 3-9h3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Optimizations
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Large <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">blur()</code> values for filter and backdrop-filter may be slow</li>
                  <li>Scaling and blurring filled rectangles will cause banding, use radial gradients instead</li>
                  <li>Sparingly enable GPU rendering with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">transform: translateZ(0)</code> for unperformant animations</li>
                  <li>Toggle will-change on unperformant scroll animations for the duration of the animation <sup>4</sup></li>
                  <li>Auto-playing too many videos on iOS will choke the device, pause or unmount off-screen videos</li>
                  <li>Bypass React&apos;s render lifecycle with refs for real-time values that commit directly to DOM <sup>5</sup></li>
                </ul>
              </section>

              {/* 6. ACCESSIBILITY */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 9l5 1m5-1l-5 1m0 0v3m0 0l-2 5m2-5l2 5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 7a.5.5 0 110-1 .5.5 0 010 1z" fill="currentColor" strokeWidth="1.5" />
                  </svg>
                  Accessibility
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Disabled buttons should not have tooltips, they are not accessible <sup>6</sup></li>
                  <li>Box shadow should be used for focus rings, not outline which won&apos;t respect radius <sup>7</sup></li>
                  <li>Focusable elements in a sequential list should be navigable with ↑ ↓</li>
                  <li>Focusable elements in a sequential list should be deletable with ⌘ Backspace</li>
                  <li>Dropdown menus should trigger on mousedown, not click, to open immediately on press</li>
                  <li>Use a SVG favicon with a style tag that adheres to system theme based on prefers-color-scheme</li>
                  <li>Icon only interactive elements should define an explicit aria-label</li>
                  <li>Tooltips triggered by hover should not contain interactive content</li>
                  <li>Images should always be rendered with &lt;img&gt; for screen readers and ease of copying</li>
                </ul>
              </section>

              {/* 7. DESIGN */}
              <section className="mb-14 space-y-4">
                <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 19A7 7 0 108 5a7 7 0 000 14z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 19a7 7 0 100-14 7 7 0 000 14z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Design
                </h2>
                <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                  <li>Optimistically update data locally and roll back on server error with feedback</li>
                  <li>Authentication redirects should happen on the server before client loads to avoid janky URL changes</li>
                  <li>Style the document selection state with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">::selection</code></li>
                  <li>Show a temporary inline checkmark on a successful copy, not a notification</li>
                  <li>Highlight the relevant input(s) on form error(s)</li>
                  <li>Empty states should prompt to create a new item, with optional templates</li>
                </ul>
              </section>

              {/* FOOTNOTES */}
              <section className="pt-8 border-t border-neutral-200 text-xs text-neutral-500 space-y-3 font-mono">
                <h3 className="uppercase tracking-wider text-neutral-400">Footnotes</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Switching themes can temporarily disable transitions to prevent unwanted animation. ↩</li>
                  <li>Frequent, low-novelty actions feel better without motion (e.g., macOS right-click menu). ↩</li>
                  <li>Most touch devices flash hover states unless restricted with @media (hover: hover). ↩</li>
                  <li>Use will-change sparingly as a last resort for performance optimization. ↩</li>
                  <li>Manipulating DOM directly with refs bypasses React render cycles for smooth 60fps+ interaction. ↩</li>
                  <li>Disabled buttons do not receive focus in DOM, making tooltips inaccessible for keyboard users. ↩</li>
                  <li>Safari historically ignores border-radius on native outline; box-shadow ensures perfect curves. ↩</li>
                </ol>
              </section>
            </div>
          </div>
        </div>

        {/* BOTTOM AMBIENT SCRIM DI TINGKAT ROOT (SAMA DENGAN REFERENSI) */}
        <div
          aria-hidden="true"
          className={`fixed bottom-0 left-0 right-0 h-[100px] md:h-[120px] pointer-events-none z-[100] ${
            isClosing ? "modal-backdrop-exit" : "modal-backdrop-enter"
          }`}
          style={{
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.65) 45%, rgba(255, 255, 255, 0) 100%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

      </div>
    </>
  );
}