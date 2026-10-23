"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      // Posisi root persis di koordinat mouse
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    // Delegasi Event Global: Cek apakah elemen di bawah titik mouse interaktif
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, [role="button"], input, textarea, select, .c-dFdHYY, .index_frame, [href]'
          )
        );
        setIsHovered(isInteractive);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'a, button, [role="button"], input, textarea, select, .c-dFdHYY, .index_frame, [href]'
          )
        );
        if (isInteractive) {
          setIsHovered(false);
        }
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
      style={{
        mixBlendMode: "difference",
      }}
    >
      {/* 
        Container Titik Pusat (0 x 0):
        Pusat simetris berada tepat di tengah (0, 0)
      */}
      <div
        className="relative pointer-events-none transition-transform duration-150 ease-out"
        style={{
          width: "0px",
          height: "0px",
          transform: isPressed ? "scale(0.82)" : "scale(1)",
        }}
      >
        {/* CROSSHAIR PLUS (20x20): Offset -10px, -10px agar perpotongan pas di (0, 0) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="absolute -top-[10px] -left-[10px] pointer-events-none transition-all duration-200 ease-out"
          style={{
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? "scale(0.4) rotate(45deg)" : "scale(1) rotate(0deg)",
          }}
        >
          <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
        </svg>

        {/* HOLLOW RING (28x28): Offset -14px, -14px agar titik pusat lingkaran pas di (0, 0) */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          className="absolute -top-[14px] -left-[14px] pointer-events-none transition-all duration-200 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "scale(1)" : "scale(0.35)",
          }}
        >
          <circle
            cx="14"
            cy="14"
            r="11.5"
            stroke="white"
            strokeWidth="1.5"
            fill="transparent"
          />
        </svg>
      </div>
    </div>
  );
}