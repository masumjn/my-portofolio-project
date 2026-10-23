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

  // Pecah judul menjadi array kata untuk efek optical depth-of-field
  const words = title ? title.trim().split(" ") : ["Web", "Interface", "Guidelines"];
  const isHarmoniIoT = title === "Harmoni IoT";
  const isSmartDoorLock = title === "Smart Door Lock" || title === "Smart Door-Lock";
  const isTerra = title === "Terra Dashboard" || title === "Terra";
  const isPtosmAlert = title === "PTOS-M Alert System" || title.includes("Alert");
  const isPtosm = (title === "PTOS-M" || title === "PTOS-M OTP" || title.includes("PTOS-M")) && !isPtosmAlert;
  const isSuroboyoSambat = title === "Suroboyo Sambat" || title.includes("Suroboyo Sambat");
  const isJethub = title === "Jet-Hub E-Commerce" || title.toLowerCase().includes("jethub") || title.toLowerCase().includes("jet-hub");

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

  // 4. Deteksi Keyboard (Escape untuk Menutup & ArrowUp / ArrowDown untuk Menggulir)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isClosing) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const SCROLL_STEP = 140;

      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollContainerRef.current?.scrollBy({
          top: SCROLL_STEP,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollContainerRef.current?.scrollBy({
          top: -SCROLL_STEP,
          behavior: "smooth",
        });
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

          {/* WADAH UTAMA MODAL */}
          <div className="relative w-full min-h-[1400px] px-6 md:px-12 flex flex-col items-center bg-white cursor-none">
            
            {/* Garis Vertikal Blueprint */}
            <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 w-[1px] pointer-events-none z-[1]" style={{ left: "calc(50% - 460px)", height: "100%", minHeight: "100vh", backgroundColor: "rgba(0, 220, 255, 0.35)" }} />
            <div aria-hidden="true" className="hidden md:block absolute top-0 bottom-0 w-[1px] pointer-events-none z-[1]" style={{ right: "calc(50% - 460px)", height: "100%", minHeight: "100vh", backgroundColor: "rgba(0, 220, 255, 0.35)" }} />

            {/* WADAH JUDUL STICKY */}
            <div
              className="sticky top-14 w-full max-w-[840px] pt-12 pb-8 z-[1] select-none pointer-events-none opacity-100"
              style={{ "--lh": "78px", "--offset": "10px" } as React.CSSProperties}
            >
              {/* Garis Horizontal Blueprint */}
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

              {/* Teks Judul H1 Dinamis */}
              <h1 className="relative font-bold tracking-[-0.035em] text-[70px] leading-[78px] text-black">
                {words.map((word, i) => {
                  let blur = "none";
                  let opacity = 1.0;
                  let color = "#000000";

                  if (words.length > 1) {
                    if (i === 0) {
                      blur = "blur(1.1px)";
                      opacity = 0.58;
                      color = "#3a3a3a";
                    } else if (i === words.length - 1) {
                      blur = "none";
                      opacity = 1.0;
                      color = "#000000";
                    } else {
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

            {/* TIRAI KONTEN DOKUMEN PUTIH SOLID */}
            <div
              className="relative z-[2] w-full max-w-[840px] pt-12 pb-44 px-12 md:px-14 leading-relaxed font-sans bg-white"
              style={{
                boxShadow: "0 -16px 32px -8px rgba(0, 0, 0, 0.04)",
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              {isJethub ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: JETHUB E-COMMERCE                         */
                /* ======================================================== */
                <>
                  {/* PROJECT METADATA */}
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            HTML5, Bootstrap 5, Alpine.js, Vanilla JavaScript (ES6+), PHP, MySQL, Midtrans Snap SDK
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Multi-Page Institutional Portal (Beranda &amp; Tentang Kami), Client-Side Product Discovery Engine, Real-time Off-Canvas Cart Machine, Dynamic Commodity Detail View
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* INTRODUCTION */}
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
                    <p className="leading-relaxed">
                      Jethub adalah platform pasar digital terintegrasi yang memfasilitasi perdagangan dan akselerasi ekspor komoditas lokal (buah, sayur, dan rempah) asal Jawa Timur. Tantangan teknis utama pada proyek ini adalah menghadirkan interaksi penjelajahan katalog, penyaringan multivariabel, dan pengelolaan keranjang belanja yang terasa instan layaknya Single-Page Application tanpa mengorbankan kesederhanaan arsitektur aplikasi web berbasis PHP. Solusi ini dicapai melalui perancangan komponen reaktif berbasis Alpine.js yang mengisolasi proses manipulasi data di memori peramban klien.
                    </p>
                  </div>

                  {/* CONTEXT & THE CORE PROBLEM */}
                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <p className="text-[14.5px] text-neutral-600">
                      Pembangunan platform komoditas ekspor lokal menuntut efisiensi penemuan produk dan keandalan transaksi tanpa membebani server monolitik:
                    </p>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>
                        <strong>Latensi Penjelajahan Katalog (Product Discovery Friction):</strong> Pengguna memerlukan pencarian teks bebas yang dapat dipadukan dengan filter kategori komoditas dan asal provinsi secara dinamis. Eksekusi penyaringan konvensional berbasis pemuatan ulang halaman (full page reload) memutus kenyamanan navigasi dan memperlambat evaluasi harga komoditas.
                      </li>
                      <li>
                        <strong>Konsistensi Status Keranjang Global (Cross-Page Cart Synchronization):</strong> Data keranjang belanja harus tersinkronisasi mulus saat pengguna berpindah dari katalog utama ke halaman spesifikasi detail produk. Perubahan jumlah barang dan total tagihan wajib terproyeksikan seketika pada lencana notifikasi tanpa memerlukan penyimpanan sesi server yang berulang.
                      </li>
                      <li>
                        <strong>Kepadatan Spasial Tipografi Produk Lokal (Micro-Layout Constraints):</strong> Penamaan komoditas pertanian dan nama entitas kelompok tani/toko daerah sering kali memiliki karakter panjang. Ruang kartu yang terbatas rentan mengalami kerusakan kerapian tata letak (layout broken) jika tidak diimbangi teknik pemotongan teks dan mikro-interaksi responsif.
                      </li>
                    </ul>
                  </section>

                  {/* DESIGN SYSTEM & VISUAL FOUNDATION */}
                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <p className="text-[14.5px] text-neutral-600">
                      Sistem visual Jethub memadukan kredibilitas identitas instansi pemerintah daerah dengan kehangatan platform perdagangan komersial:
                    </p>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>
                        <strong>Palet Warna Semantik:</strong>
                        <ul className="list-circle pl-6 mt-1.5 space-y-1.5 text-[14px] text-neutral-600">
                          <li><strong>Primary Blue (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#385997</code>):</strong> Penanda identitas utama yang diaplikasikan pada navigasi rute aktif, tombol primer (btn-blue), garis pembatas input, serta aksen teks harga.</li>
                          <li><strong>Hover &amp; Active Shades (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#4B6CA8 / #304D84</code>):</strong> Memberikan kedalaman visual dan respons taktil saat elemen tombol disentuh atau ditekan.</li>
                          <li><strong>Background Surfaces (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#D9E4F7 &amp; #F8F9FA</code>):</strong> Latar belakang biru pastel muda pada footer dan abu-abu terang pada kontainer kartu untuk mempertahankan kontras baca dokumen.</li>
                        </ul>
                      </li>
                      <li>
                        <strong>Standardisasi Rasio Visual (Ratio Placeholder Utility):</strong> Penerapan rasio kanvas buatan kustom <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">.ratio-3x2</code> (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">--bs-aspect-ratio: 66.67%</code>) pada setiap wadah gambar komoditas, memastikan seluruh kartu dalam grid memiliki dimensi tinggi yang seragam tanpa terdistorsi oleh variasi resolusi foto asli.
                      </li>
                      <li>
                        <strong>Pengendalian Ruang Teks (Inline Truncation):</strong> Nama komoditas yang melampaui 20 karakter secara otomatis dipotong di sisi klien dan diakhiri elipsis, menjaga keselarasan baris horizontal antar-kartu.
                      </li>
                    </ul>
                  </section>

                  {/* SCREEN ARCHITECTURE & USER FLOW */}
                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    
                    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 font-mono text-xs text-neutral-800 overflow-x-auto">
                      [ Beranda: Hub Ekspor ] ──&gt; [ Katalog Komoditas &amp; Filter ] &lt;──&gt; [ Off-Canvas Cart ] ──&gt; [ Detail Spesifikasi Produk ]
                    </div>

                    {/* FASE 1: LANDING & TENTANG KAMI */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Institutional Landing &amp; Legal Identity (Beranda &amp; Tentang Kami)</h3>
                      <p className="text-[14.5px] text-neutral-700">
                        Menyajikan landasan hukum ekspor Jawa Timur, alur panduan layanan daring/luring, integrasi pemangku kepentingan lintas instansi, serta peta geografis kantor operasional.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/jethub-beranda.png" alt="Jethub Beranda" loading="lazy" className="w-full h-auto block object-cover" />
                          <div className="p-2 text-center text-xs font-mono text-neutral-500 bg-white border-t border-neutral-100">
                            Beranda: Hub Ekspor &amp; Panduan Layanan
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/jethub-tentang-kami.png" alt="Jethub Tentang Kami" loading="lazy" className="w-full h-auto block object-cover" />
                          <div className="p-2 text-center text-xs font-mono text-neutral-500 bg-white border-t border-neutral-100">
                            Tentang Kami: Landasan Hukum &amp; Peta Operasional
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FASE 2: PRODUCT DISCOVERY */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Client-Side Product Discovery (Katalog Komoditas Jet-Hub)</h3>
                      <p className="text-[14.5px] text-neutral-700">
                        Mesin katalog terpadu tempat pengguna menelusuri komoditas pertanian melalui pencarian kata kunci dan penyaringan kategori ganda (Rempah, Buah, Sayur, dan Provinsi).
                      </p>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/jethub-katalog.png" alt="Jethub Katalog Komoditas" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>

                    {/* FASE 3: OFFCANVAS CART */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Real-Time Off-Canvas Cart Engine</h3>
                      <p className="text-[14.5px] text-neutral-700">
                        Laci navigasi geser dari sisi kanan layar yang memproyeksikan isi keranjang belanja, kalkulasi subtotal instan, ilustrasi keranjang kosong, dan formulir data pemesan tanpa memutus penelusuran katalog.
                      </p>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/jethub-cart-open.png" alt="Jethub Offcanvas Cart Engine" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>

                    {/* FASE 4: DETAIL SPESIFIKASI */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Comprehensive Commodity Detail View (produk/[slug])</h3>
                      <p className="text-[14.5px] text-neutral-700">
                        Halaman penelaahan komoditas secara mendalam untuk memvalidasi kelayakan spesifikasi sebelum melakukan pembelian partai besar dengan kotak pembelian melayang dan breadcrumb pintar.
                      </p>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/jethub-detail.png" alt="Jethub Detail Produk" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  {/* FEATURE DEEP-DIVE & ENGINEERING HIGHLIGHTS */}
                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>
                        <strong>Arsitektur Fetch-Once &amp; Penyaringan Sisi Klien:</strong> Penarikan data JSON dari endpoint <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">getdata.php</code> dieksekusi sekali saat <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">x-init="load()"</code> dipicu[cite: 44]. Pencarian teks (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">search</code>), filter kategori (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">selectedCategory</code>), dan provinsi (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">selectedProvince</code>) diproses langsung di memori peramban klien via fungsi <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">paginatedItems</code> lengkap dengan proteksi reset halaman (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">@input="resetPage"</code>)[cite: 44].
                      </li>
                      <li>
                        <strong>Mesin Status Keranjang Global (Alpine.js Global Store):</strong> Manajemen data keranjang diikat pada penyimpan global <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">Alpine.store('cart')</code> yang dapat diakses merata dari katalog maupun halaman detail. Perubahan jumlah barang langsung merefleksikan lencana merah notifikasi di navbar tanpa *page reload*, dan diserialisasikan ke format string JSON (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">JSON.stringify</code>) siap kirim ke Midtrans Snap SDK.
                      </li>
                      <li>
                        <strong>Mikro-Interaksi Taktil Pengalaman Pengguna:</strong>
                        <ul className="list-circle pl-6 mt-1.5 space-y-1.5 text-[14px] text-neutral-600">
                          <li><strong>Rolling Merchant Text:</strong> Menggunakan transformasi CSS <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">.words span &#123; transform: translateY(-100%); &#125;</code> saat kartu produk di-hover untuk menggulung nama toko dan menampilkan asal kabupaten secara halus[cite: 43].</li>
                          <li><strong>Dynamic Breadcrumb Expansion:</strong> Memotong teks nama barang hingga 35 karakter di halaman detail dan menampilkannya utuh saat kursor didekatkan melalui pendengar event <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">mouseenter</code> dan <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">mouseleave</code>[cite: 43].</li>
                          <li><strong>Rotasi Halus Menu Hamburger:</strong> Mengubah garis tiga menjadi silang (X) secara mulus via transisi rotasi 180 derajat dan opasitas berdurasi 300ms[cite: 43].</li>
                        </ul>
                      </li>
                    </ul>
                  </section>

                  {/* PERFORMANCE, USABILITY & ACCESSIBILITY STANDARDS */}
                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Performance, Usability &amp; Accessibility Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>
                        <strong>Pencegahan Beban Server Monolitik:</strong> Seluruh operasi pencarian, pemilihan filter, peralihan halaman paginasi, dan perombakan kuantitas keranjang berjalan murni di peramban klien tanpa mengirimkan permintaan HTTP bolak-balik ke server Apache/PHP.
                      </li>
                      <li>
                        <strong>Kesesuaian Format Nilai Uang:</strong> Fungsi utilitas <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">rupiah()</code> memformat angka bulat menjadi representasi mata uang Indonesia standar lengkap dengan pemisah titik ribuan secara konsisten.
                      </li>
                      <li>
                        <strong>Penguncian Validitas Checkout:</strong> Tombol finalisasi pesanan dikunci statusnya (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">disabled state</code>) dengan kursor penunjuk terblokir jika keranjang masih dalam kondisi kosong atau formulir kontak belum terisi lengkap.
                      </li>
                    </ul>
                  </section>

                  {/* KEY TAKEAWAYS & IMPACT */}
                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>
                        <strong>Penyatuan Monolith PHP dengan Pengalaman SPA:</strong> Membuktikan bahwa aplikasi berbasis PHP tradisional dapat menyajikan responsivitas instan tanpa pemuatan ulang layar melalui injeksi state management ringan Alpine.js.
                      </li>
                      <li>
                        <strong>Transparansi Ekosistem Komoditas Daerah:</strong> Berhasil mengemas data komoditas pertanian, regulasi legal formal ekspor, dan kontak instansi ke dalam tata letak katalog modern yang meningkatkan kepercayaan pembeli luar daerah maupun mitra ekspor.
                      </li>
                      <li>
                        <strong>Efisiensi Manajemen State Skala Menengah:</strong> Pemanfaatan global store tanpa kompleksitas build tools berat menghasilkan alur penambahan barang ke keranjang yang cepat, stabil, dan siap terintegrasi ke gerbang pembayaran digital.
                      </li>
                    </ul>
                  </section>
                </>
              ) : isPtosmAlert ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: PTOS-M ALERT SYSTEM (RESILIENT UX)        */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            JavaScript (ES6+), CSS3 (Flexbox, CSS Transitions), AJAX / Fetch API (Global Request Interceptor), HTML5 Clipboard API, Custom Stateful Modals
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Real-time Vertical Stepper Modal, Multi-Condition Approval Validator, Cloudflare Network Error Interceptor, Diagnostic Traceability Box, 1-Click Helpdesk Clipboard Engine
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Pada sistem operasional pelabuhan terintegrasi PTOS-M (PT Pelabuhan Indonesia), kegagalan jaringan atau penolakan validasi bisnis merupakan kondisi kritis yang dapat menghentikan arus logistik terminal. Pembaruan arsitektur Feedback &amp; Alert System ini mentransformasikan pesan kesalahan teknis yang kaku menjadi panduan pemecahan masalah mandiri (self-service troubleshooting). Sistem ini mengintegrasikan pelacak progres multi-tahap real-time (Vertical Stepper), validasi kondisional berjenjang (Approval Multi-Stage), serta interseptor kode kesalahan infrastruktur Cloudflare terpusat yang dilengkapi fitur penyalinan log diagnostik instan ke helpdesk.
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Kebutaan Progres Asinkron (Process Blindness) pada menu Penetapan Bongkar Muat.</li>
                      <li>Kompleksitas Validasi Lintas-Tahapan (Multi-Stage Workflow Locking) pada menu Verifikasi LKBM.</li>
                      <li>Kegagalan Infrastruktur Jaringan (Cloudflare Gateway Drops) pada aplikasi enterprise.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Semantics
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Semantic Color &amp; Icon: Emerald Green (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#10B981</code>), Amber Warning (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#F59E0B</code>), dan Crimson Error (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#EF4444</code>).</li>
                      <li>Anatomi dialog terstandarisasi dengan Header Status Hero dan Detail Box (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">bg-slate-50</code>).</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Real-Time Progress Stepper (Menu Penetapan)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-penetapan-success.png" alt="Stepper Penetapan Berhasil" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-penetapan-partial.png" alt="Stepper Penetapan Parsial" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Multi-Condition Approval Validator (Menu Verifikasi LKBM)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-verifikasi-warning.png" alt="Verifikasi Warning Approval 1" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-verifikasi-blocked.png" alt="Verifikasi Blocked Approval 1 &amp; 2" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Cloudflare Global Error Interceptor (Self-Healing Dialog)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-error-403.png" alt="Error 403 Forbidden Modal" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-error-524.png" alt="Error 524 Timeout Modal" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/ptos-m-error-526.png" alt="Error 526 SSL Certificate Modal" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Pola Desain Partial-Success pada Vertical Stepper dengan eksekusi *Promise chaining*.</li>
                      <li>Traceability Engine &amp; State Matrix Verifikasi LKBM dengan tombol salin mandiri.</li>
                      <li>Kamus Pemetaan Global Status HTTP Cloudflare (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">CF_STATUS</code>) dan Tombol Salin Log Diagnostik Helpdesk.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Usability, Accessibility &amp; Performance Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Aksesibilitas dialog <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">role="alertdialog"</code>, umpan balik papan klip, dan pembersihan antrean modal.</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Self-Healing Enterprise UX, Akurasi Triase Insiden Operasional, dan Transparansi Alur Kerja Asinkron.</li>
                    </ul>
                  </section>
                </>
              ) : isSuroboyoSambat ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: SUROBOYO SAMBAT                           */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            JavaScript (ES6+), Tailwind CSS, HTML5 File API &amp; Drag-and-Drop, HTML5 Canvas API / D3.js Word Cloud Engine, AJAX / Fetch API (Python / Flask / FastAPI Backend)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Single-Page Analytics Landing Interface, Client-Side Excel File Validator &amp; Uploader, Dynamic Weighted Word Cloud, 17-Cluster Interactive Filtering Suite
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Suroboyo Sambat adalah platform analitik web pemrosesan bahasa alami (Natural Language Processing) yang dirancang untuk mengekstrak dan memvisualisasikan data sentimen masyarakat terhadap Walikota dan Wakil Walikota Surabaya berdasarkan korpus komentar media sosial Instagram[cite: 30]. Tantangan rekayasa frontend pada proyek ini berfokus pada mitigasi jeda waktu komputasi model Machine Learning, perancangan alur unggah dokumen Excel yang aman di sisi peramban, serta visualisasi dinamis 17 klaster topik keluhan warga ke dalam Word Cloud interaktif berbasis kanvas[cite: 30].
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Waktu Tunggu Komputasi (Processing Latency Gap) model NLP.</li>
                      <li>Validasi Berkas di Sisi Klien (Client-Side File Validation) format Excel.</li>
                      <li>Beban Kognitif Data Mentah (Data Overload Abstraction) ribuan komentar warga.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Hero &amp; Brand Gradient (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#6D28D9 → #F59E0B</code>).</li>
                      <li>Section Contrast Surface Dark Slate (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#111827</code>) pada blok "Tujuan ?".</li>
                      <li>17-Cluster Category Tokens dan Tipografi Skala Frekuensi (Weighted Typography).</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Hero Banner &amp; Context Header</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/suroboyo-sambat-hero.png" alt="Suroboyo Sambat Hero Banner" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">The Analytics Workstation (Panggung Unggah &amp; Word Cloud)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/suroboyo-sambat-workstation.png" alt="Suroboyo Sambat Workstation" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">17-Cluster Interactive Tag Suite</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/suroboyo-sambat-tags.png" alt="Suroboyo Sambat Tags" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Purpose Narrative &amp; 3-Step Process Guide</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/suroboyo-sambat-guide.png" alt="Suroboyo Sambat Guide" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Arsitektur Penanganan Berkas Klien (HTML5 File API) dengan Drag-and-Drop.</li>
                      <li>Mesin State 4-Tahap Pengendali Latensi NLP (*Idle, Uploading, Processing, Success*).</li>
                      <li>Algoritma Render Word Cloud Berbasis Kanvas Dinamis (*force-directed layout*).</li>
                      <li>Penyaringan Klaster Asinkron Tanpa Reload (*zero page reload*).</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Performance, Usability &amp; Accessibility Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Pencegahan Memory Leak kanvas via <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">context.clearRect()</code>.</li>
                      <li>Target sentuh minimal 40px pada tag klaster dan penguncian tombol ganda (*Double-Submit Lock*).</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Demokratisasi Data NLP Kompleks, Seamless Async UX, dan High-Impact Civic Data Visualization.</li>
                    </ul>
                  </section>
                </>
              ) : isPtosm ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: PTOS-M 2FA OTP                            */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            ASP.NET Core (.cshtml Razor Pages), Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid, CSS Transitions), Cloudflare Turnstile API, AJAX / Fetch API
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Split-View Authentication View, In-Page SPA State Machine, Interactive 6-Digit OTP Component, Countdown Resend Engine, Announcement Banner Modal
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Pada pembaruan sistem manajemen pelabuhan terintegrasi PTOS-M (kolaborasi Pelindo dan Danantara Indonesia), antarmuka Two-Factor Authentication (2FA) berbasis One-Time Password (OTP) dirancang untuk mematuhi regulasi keamanan siber per 30 September 2026. Tantangan utama rekayasa frontend pada proyek ini adalah menyatukan dua tahap otentikasi (Kredensial dan OTP) ke dalam satu berkas tampilan server-side rendering (.cshtml) dengan pengalaman transisi mulus layaknya Single-Page Application (SPA) tanpa memicu pemuatan ulang halaman (page reload).
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Friksi Arsitektur Multi-Page (.cshtml Razor Pages).</li>
                      <li>Kompleksitas State Management Multi-Tahap (Kredensial $\to$ OTP).</li>
                      <li>Mitigasi Human Error Masukan OTP melalui 6-segmen independen.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Panel ganda split-view (Left: Biru Maritim korporat, Right: Card putih rounded-2xl).</li>
                      <li>Pelindo Primary Blue dan Success Emerald Green (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#10B981</code>).</li>
                      <li>Tipografi angka tabular (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">tabular-nums</code>) pada timer dan kotak digit OTP.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Policy Announcement &amp; Onboarding Banner</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/ptos-m-otp-banner.png" alt="PTOS-M OTP Onboarding Banner" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">State 1: Credential &amp; Cloudflare Turnstile View</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/ptos-m-login.png" alt="PTOS-M Credential Login State" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">State 2: Active 6-Digit OTP &amp; Resend Countdown</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/ptos-m-otp.png" alt="PTOS-M 6-Digit OTP Entry State" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">State 3: Verified State &amp; Auto-Dispatch</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/ptos-m-otp-verified.png" alt="PTOS-M OTP Verified State" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Mesin State Sederhana pada Arsitektur .cshtml Razor Pages (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">transition: opacity 250ms</code>).</li>
                      <li>Mikro-interaksi OTP: Auto-advance, backspace jump-back, dan pencegatan clipboard (paste event).</li>
                      <li>Logika timer resend 2 menit dan sesi Trusted Device.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Performance, Security &amp; Accessibility Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Keypad numerik seluler via <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">inputmode="numeric"</code>, isolasi autofill, dan cincin fokus box-shadow.</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Seamless Enterprise Security Compliance, Hybrid SPA Experience on Legacy Architecture, dan Error-Resilient Input Flow.</li>
                    </ul>
                  </section>
                </>
              ) : isTerra ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: TERRA DASHBOARD                           */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            HTML5, CSS3, JavaScript (ES6+), Chart Engine / HTML5 Canvas API, AJAX / Fetch API, PHP, MySQL[cite: 20]
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            7-in-1 Soil Metrics Grid, Dual-Actuator Control Panel, Multi-Variable Time-Series Chart Suite, Auth Module[cite: 20]
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Terra (dikembangkan bersama EIIoT - Telkom University Surabaya) adalah platform web pemantauan pertanian presisi (precision agriculture) berbasis IoT[cite: 20]. Antarmuka ini mengintegrasikan pembacaan sensor tanah 7-in-1 secara berkala (N, P, K, pH, Kelembaban, Suhu, dan Konduktivitas Listrik), visualisasi analitik tren historis multi-grafik, serta kendali aktuator pompa air dan humidifier dengan eksekusi status berlatensi rendah[cite: 20].
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Beban Kognitif Data Multivariabel 7-in-1, Performa Render Multi-Grafik Simultan, dan Keandalan Saklar Aktuator Fisik[cite: 20].</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Warna semantik parameter tanah (Kelembaban, Suhu, pH, EC, NPK), status On/Off aktuator, dan tipografi tabular (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">tabular-nums</code>)[cite: 20].</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Authentication Module (login.php)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/terra-login.png" alt="Terra Authentication Screen" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Main Telemetry Dashboard (index.php)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/terra-dashboard.png" alt="Terra 7-in-1 Soil Telemetry Dashboard" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Time-Series Diagram Analytics (diagram.php)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/terra-diagram.png" alt="Terra Time-Series Diagram Analytics" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Actuator Control Center (kontrol.php)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/terra-pump.png" alt="Terra Actuator Control Center" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2-12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Rendering Canvas Multi-Grafik Terisolasi, Polling Asinkron JSON, dan Optimistic UI State Machine[cite: 20].</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Touch, Performance &amp; Accessibility Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Pencegahan zoom input 16px, touch area minimum 48x48px, dan eliminasi tap-highlight[cite: 20].</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Visual Data Democratization, Optimized Multi-Chart Dashboard, dan Actionable IoT Automation[cite: 20].</li>
                    </ul>
                  </section>
                </>
              ) : isSmartDoorLock ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: SMART DOOR LOCK                           */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            HTML5, CSS3 (Custom Button &amp; Card Styling), Vanilla JavaScript (ES6+), AJAX / Fetch API, HTML5 Video Engine (Mechanical Solenoid Animation), PHP, MySQL
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Main Control Dashboard (Actuator Interactive Switch), Real-time Telemetry Widgets, Chronological Access History Log System
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Smart Door Lock adalah antarmuka web kontrol akses fisik berbasis IoT yang dirancang untuk mengoperasikan aktuator silinder solenoid pintu secara instan. Menggabungkan visualisasi mekanik 3D tersinkronisasi, telemetri daya/konektivitas, dan pencatatan audit riwayat buka-tutup secara real-time dengan pendekatan antarmuka berlatensi rendah (Low-Latency Mechanical UX).
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Kepastian Status Fisik, Visualisasi Aksi Mekanis Real-time, dan Audit Trail &amp; Akuntabilitas.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Canvas bernuansa Slate Dark Gray (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#4A5568</code>), tombol toggle pill, dan tipografi tabular.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">Main Control Viewport (index.php)</h3>
                      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-900" style={{ aspectRatio: "16/9" }}>
                        {isOpen && !isClosing && (
                          <video
                            src="/videos/smart-door-lock.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full min-w-full min-h-full block object-cover object-center origin-center scale-[1.35]"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/smart-door-lock-lock.png" alt="Smart Door Lock Locked State" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                          <img src="/images/smart-door-lock-unlock.png" alt="Smart Door Lock Unlocked State" loading="lazy" className="w-full h-auto block object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">Access History Log Screen (history.php)</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/smart-door-lock-history.png" alt="Smart Door Lock Chronological Audit Log Screen" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2-12 8 18" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Sinkronisasi Video Solenoid Aktuator Bebas Jeda (&lt;100ms), Optimistic Hardware State, dan Logging Otomatis.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Touch, Performance &amp; Accessibility Standards
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Penanganan dead area tombol gembok luas dan outline focus melengkung berbasis box-shadow.</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>High-Fidelity Visual Confirmation, Lightweight Real-time Architecture, dan Transparent Security Auditing.</li>
                    </ul>
                  </section>
                </>
              ) : isHarmoniIoT ? (
                /* ======================================================== */
                /* KONTEN KHUSUS: HARMONI IOT                               */
                /* ======================================================== */
                <>
                  <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                    <table className="w-full text-left text-sm text-neutral-700">
                      <thead className="bg-neutral-50 text-xs font-mono uppercase text-neutral-500 border-b border-neutral-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold w-1/4">Atribut</th>
                          <th className="px-5 py-3 font-semibold">Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 font-mono text-[13px]">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Tech Stack</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, AJAX / Fetch API, WebSockets / MJPEG Stream, MySQL &amp; PHP Backend
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-neutral-900 bg-neutral-50/40">Deliverables</td>
                          <td className="px-5 py-3.5 leading-relaxed text-neutral-600">
                            Responsive Web App, Design System, ESP32-CAM Live Feed Integration, Multi-mode Switch Controller
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <p className="leading-relaxed">
                      Hello Mowny adalah platform web dashboard interaktif yang menjembatani otomasi perangkat keras mikrokontroler (ESP32) dan pengguna akhir, menyajikan kontrol 4 mode saklar cerdas (relay) serta transmisi langsung kamera IoT dengan pendekatan Zero-Latency UX dan Optimistic UI.
                    </p>
                  </div>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Context &amp; The Core Problem
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Latensi Fisik Perangkat Keras, Beban Render Aliran Visual, dan Fragmentasi Mode Kontrol.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9-9" />
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8" />
                      </svg>
                      Design System &amp; Visual Foundation
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Signature Gradient (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-xs">#E11D48 → #9333EA</code>), token warna status relay, dan angka tabular.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-6">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                      </svg>
                      Screen Architecture &amp; User Flow
                    </h2>
                    <div className="space-y-3 pt-2">
                      <h3 className="text-base font-semibold text-neutral-900">1. Hero Splash Screen</h3>
                      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-black" style={{ aspectRatio: "16/9" }}>
                        {isOpen && !isClosing && (
                          <video
                            src="/videos/harmoni-iot.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full min-w-full min-h-full block object-cover object-center origin-center scale-[1.35]"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">2. Split-View Authentication Screen</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/harmoni-login.png" alt="Hello Mowny Split-View Login" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-base font-semibold text-neutral-900">3. Main Dashboard &amp; Monitoring Widgets</h3>
                      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm bg-neutral-100">
                        <img src="/images/harmoni-dashboard.png" alt="Hello Mowny Live Dashboard" loading="lazy" className="w-full h-auto block object-cover" />
                      </div>
                    </div>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="6" />
                        <circle cx="8" cy="12" r="3" />
                      </svg>
                      Feature Deep-Dive &amp; Engineering Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Digital Switch, Object Detect Switch, Routine Switch, dan Scheduled Switch.</li>
                    </ul>
                  </section>

                  <section className="mb-14 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black border-b border-neutral-100 pb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      Engineering &amp; Frontend Highlights
                    </h2>
                    <ul className="list-disc pl-5 space-y-3 text-[14.5px] text-neutral-700">
                      <li>Optimistic UI Updates (&lt;150ms), optimisasi sentuhan mobile, dan aksesibilitas navigasi keyboard.</li>
                    </ul>
                  </section>

                  <section className="pt-8 border-t border-neutral-200 space-y-4">
                    <h2 className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black pb-1">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Key Takeaways &amp; Impact
                    </h2>
                    <ul className="list-disc pl-5 space-y-2.5 text-[14.5px] text-neutral-700">
                      <li>Seamless Hardware-Software Synchrony dan Unified Multi-Condition Dashboard.</li>
                    </ul>
                  </section>
                </>
              ) : (
                /* ======================================================== */
                /* KONTEN DEFAULT LENGKAP: WEB INTERFACE GUIDELINES        */
                /* ======================================================== */
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM AMBIENT SCRIM */}
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