"use client";

import React, { useEffect, useState, useCallback } from "react";

interface IframeModalProps {
  isOpen: boolean;
  url: string;
  title: string;
  clickOrigin: { x: number; y: number } | null;
  onClose: () => void;
}

export default function IframeModal({
  isOpen,
  url,
  title,
  clickOrigin,
  onClose,
}: IframeModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kunci scroll body saat modal aktif
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsClosing(false);
      setIsLoading(true);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Fungsi tutup modal dengan animasi shrink
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 280);
  }, [isClosing, onClose]);

  // Tutup dengan tombol Escape
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

  const originX = clickOrigin?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const originY = clickOrigin?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  return (
    <>
      <style>{`
        @keyframes expandFromOrigin {
          0% {
            transform: scale(0.01);
            opacity: 0;
            border-radius: 9999px;
          }
          40% {
            opacity: 1;
            border-radius: 28px;
          }
          100% {
            transform: scale(1);
            opacity: 1;
            border-radius: 0px;
          }
        }
        @keyframes shrinkToOrigin {
          0% {
            transform: scale(1);
            opacity: 1;
            border-radius: 0px;
          }
          60% {
            opacity: 0.8;
            border-radius: 28px;
          }
          100% {
            transform: scale(0.01);
            opacity: 0;
            border-radius: 9999px;
          }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .modal-expand-enter {
          animation: expandFromOrigin 360ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity, border-radius;
        }
        .modal-shrink-exit {
          animation: shrinkToOrigin 280ms cubic-bezier(0.4, 0, 0.8, 0.15) forwards;
          will-change: transform, opacity, border-radius;
        }
        .modal-backdrop-enter {
          animation: backdropFadeIn 360ms ease-out forwards;
        }
        .modal-backdrop-exit {
          animation: backdropFadeOut 280ms ease-out forwards;
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-0 z-[9999] overflow-hidden cursor-none select-none"
      >
        {/* Backdrop Dimmer */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-sm ${
            isClosing ? "modal-backdrop-exit" : "modal-backdrop-enter"
          }`}
          onClick={handleClose}
        />

        {/* Modal Sheet Beranimasi Dari Titik Klik */}
        <div
          style={{ transformOrigin: `${originX}px ${originY}px` }}
          className={`fixed inset-0 w-screen h-screen bg-[#111111] overflow-hidden flex flex-col cursor-none ${
            isClosing ? "modal-shrink-exit" : "modal-expand-enter"
          }`}
        >
          {/* Header Bar */}
          <header className="w-full h-14 bg-[rgba(18,18,18,0.92)] backdrop-blur-xl border-b border-white/[0.08] z-10 flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3 max-w-[65%] truncate">
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-none shrink-0"
              >
                ← Close (Esc)
              </button>
              <div className="w-[1px] h-4 bg-white/20 hidden sm:block shrink-0" />
              <span className="font-sans text-[13px] text-white/90 truncate hidden sm:block font-medium">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka di Tab Baru"
                className="h-9 px-3 rounded-lg border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-none"
              >
                <span>Buka Tab Baru</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <button
                type="button"
                aria-label="Tutup jendela"
                onClick={handleClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 active:bg-white/20 border border-white/10 flex items-center justify-center transition-colors cursor-none"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Iframe Viewport */}
          <div className="relative w-full flex-1 bg-[#1e1e1e] overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111111] z-0">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="font-mono text-xs text-white/50 tracking-wider uppercase">
                  Memuat Dokumen Jurnal...
                </span>
              </div>
            )}

            <iframe
              src={url}
              title={title}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-none relative z-10 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      </div>
    </>
  );
}