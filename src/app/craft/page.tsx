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

      {/* Action Button */}
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
      
      {/* KEYFRAMES ANIMASI MOCKUP */}
      <style>{`
        /* 1. Animasi Gulir JetHub */
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

        /* 2. Animasi Redup-Nyala Asimetris Terra */
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

        /* 3. Animasi Gulir Suroboyo Sambat */
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

        /* 4. Animasi Kedipan Putih Suroboyo Sambat */
        @keyframes whiteBlinkSuroboyo {
          0%, 84% { opacity: 0; }
          89%, 93% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        .animate-flash-suroboyo {
          animation: whiteBlinkSuroboyo 14s infinite;
          will-change: opacity;
        }

        /* 5. Animasi Slideshow Geser Kiri PTOS-M Alert System */
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
          {/* KOLOM 1: PTOS-M -> Harmoni IoT -> PTOS-M Alert System    */}
          {/* ======================================================== */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 1. PTOS-M OTP */}
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

            {/* 4. Harmoni IoT */}
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

            {/* 7. PTOS-M Alert System */}
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
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-verifikasi-warning.png"
                      alt="Alert Verifikasi"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-penetapan-partial.png"
                      alt="Alert Penetapan"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="w-1/4 h-full relative flex-shrink-0">
                    <img
                      src="/images/ptos-m-error-403.png"
                      alt="Alert Cloudflare"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
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
          </div>

          {/* ======================================================== */}
          {/* KOLOM 2: Terra Dashboard -> Jet-Hub E-Commerce            */}
          {/* ======================================================== */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 2. Terra Dashboard */}
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

            {/* 5. Jet-Hub E-Commerce */}
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
          </div>

          {/* ======================================================== */}
          {/* KOLOM 3: Smart Door-Lock -> Suroboyo Sambat              */}
          {/* ======================================================== */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* 3. Smart Door-Lock */}
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

            {/* 6. Suroboyo Sambat */}
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
          </div>

        </div>
      </main>
    </div>
  );
}