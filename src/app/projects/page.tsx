"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomCursor from "@/components/CustomCursor";
import TopBar from "@/components/TopBar";
import IframeModal from "@/components/IframeModal";

interface PublicationItem {
  title: string;
  institution: string;
  journal: string;
  authorOrder: string;
  authors: string;
  year: string;
  doi: string;
  accreditation: string;
}

// Data Publikasi Jurnal Ilmiah Terindeks SINTA
const PUBLICATIONS_DATA: PublicationItem[] = [
  {
    title: "HARMONI: Home Automation Module Berbasis Internet of Things dan Deep Learning",
    institution: "Politeknik Harapan Bersama",
    journal: "Jurnal Informatika: Jurnal Pengembangan IT Vol 10, No 2 (2025); 520-526",
    authorOrder: "Author Order : 1 of 3",
    authors: "Juniyanto, Muhammad Ma'sum; Aji, Bernadus Anggo Seno; Kamali, Muhammad Adib",
    year: "2025",
    doi: "10.30591/jpit.v10i2.7109",
    accreditation: "Accred : Sinta 3",
  },
  {
    title: "PEMBUATAN COMPANY PROFILE YAYASAN BERBASIS WEB UNTUK MENINGKATKAN KUNJUNGAN DIGITAL CALON DONATUR",
    institution: "Universitas Muhammadiyah Mataram",
    journal: "JMM (Jurnal Masyarakat Mandiri) Vol 8, No 1 (2024): Februari; 590-599",
    authorOrder: "Author Order : 1 of 3",
    authors: "Muhammad Ma'sum Juniyanto; Oktavia Ayu Permata; Farah Zakiyah Rahmanti",
    year: "2024",
    doi: "10.31764/jmm.v8i1.19408",
    accreditation: "Accred : Sinta 3",
  },
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Komponen Baris Rekam Publikasi Ilmiah
function PublicationRow({
  item,
  entranceDelay,
  onOpenIframe,
}: {
  item: PublicationItem;
  entranceDelay: number;
  onOpenIframe: (e: React.MouseEvent<HTMLAnchorElement>, url: string, title: string) => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  // Animasi Cipher Scramble HANYA pada Judul Publikasi (Line 1)
  useEffect(() => {
    let initialScrambled = "";
    for (let i = 0; i < item.title.length; i++) {
      if (item.title[i] === " " || item.title[i] === ":" || item.title[i] === "-") {
        initialScrambled += item.title[i];
      } else {
        initialScrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }
    setDisplayText(initialScrambled);

    const startTimer = setTimeout(() => {
      setIsStarted(true);
      let frame = 0;
      const totalFrames = item.title.length * 2 + 8;

      const interval = setInterval(() => {
        frame++;
        let result = "";

        for (let i = 0; i < item.title.length; i++) {
          if (item.title[i] === " " || item.title[i] === ":" || item.title[i] === "-") {
            result += item.title[i];
            continue;
          }

          if (frame > i * 2 + 4) {
            result += item.title[i];
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplayText(result);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(item.title);
        }
      }, 20);

      return () => clearInterval(interval);
    }, entranceDelay);

    return () => clearTimeout(startTimer);
  }, [item.title, entranceDelay]);

  const doiUrl = `https://doi.org/${item.doi}`;

  return (
    <div
      className={`group relative flex flex-col w-full p-4 -mx-4 rounded-[12px] border border-transparent hover:border-neutral-200/80 hover:bg-[#ededed]/60 transition-all duration-200 cursor-none select-none ${
        isStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      }`}
      style={{
        transitionProperty: "opacity, transform, background-color, border-color",
        transitionDuration: "250ms",
      }}
    >
      {/* LINE 1: JUDUL DENGAN GARIS DINAMIS MENGIKUTI AKHIR BARIS TEKS */}
      <div className="w-full overflow-hidden mb-2">
        <a
          href={doiUrl}
          onClick={(e) => onOpenIframe(e, doiUrl, item.title)}
          className="inline font-medium text-[16px] md:text-[17px] leading-snug text-[#007791] hover:text-[#005f73] transition-colors cursor-none tracking-tight"
        >
          <span>{displayText || item.title}</span>

          {/* Garis Horizontal Dinamis Menuju Tepi Paling Kanan */}
          <span
            aria-hidden="true"
            className="inline-block align-middle h-[1px] bg-neutral-200 group-hover:bg-neutral-300 w-[2000px] -mr-[2000px] ml-4 transition-colors"
          />
        </a>
      </div>

      {/* LINE 2: INSTITUSI AFILIASI & NAMA JURNAL (KLIK BUKA IFRAME) */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] md:text-[13.5px] leading-normal text-neutral-500 mb-1">
        <span>{item.institution}</span>

        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-[#0284c7] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>

          <a
            href={doiUrl}
            onClick={(e) => onOpenIframe(e, doiUrl, item.journal)}
            className="text-[#0284c7] hover:underline transition-colors cursor-none"
          >
            {item.journal}
          </a>
        </div>
      </div>

      {/* LINE 3: STATUS URUTAN KEPENGARANGAN */}
      <div className="text-[12.5px] md:text-[13px] text-neutral-500 mb-1">
        {item.authorOrder}
      </div>

      {/* LINE 4: DAFTAR PENULIS */}
      <div className="text-[13px] md:text-[13.5px] text-neutral-600 mb-2.5 leading-relaxed">
        {item.authors}
      </div>

      {/* LINE 5: INDIKATOR TELEMETRI & AKREDITASI SINTA */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] md:text-[13px] text-neutral-500 font-mono">
        {/* Tahun Terbit */}
        <div className="flex items-center gap-1.5 text-neutral-500">
          <svg
            className="w-3.5 h-3.5 text-neutral-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{item.year}</span>
        </div>

        {/* DOI Link Identifier (KLIK BUKA IFRAME) */}
        <div className="flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-[#0284c7] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <a
            href={doiUrl}
            onClick={(e) => onOpenIframe(e, doiUrl, `DOI: ${item.doi}`)}
            className="text-[#0284c7] hover:underline transition-colors cursor-none"
          >
            DOI: {item.doi}
          </a>
        </div>

        {/* Akreditasi SINTA Badge */}
        <div className="flex items-center gap-1.5 text-[#d97706] font-medium font-sans">
          <svg
            className="w-3.5 h-3.5 text-[#d97706] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <span>{item.accreditation}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    clickOrigin: { x: number; y: number } | null;
  }>({
    isOpen: false,
    url: "",
    title: "",
    clickOrigin: null,
  });

  const handleOpenIframe = useCallback((e: React.MouseEvent<HTMLAnchorElement>, url: string, title: string) => {
    e.preventDefault();
    setModalState({
      isOpen: true,
      url,
      title,
      clickOrigin: { x: e.clientX, y: e.clientY },
    });
  }, []);

  const handleCloseIframe = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-[#111111] cursor-none overflow-x-hidden">
      <CustomCursor />

      {/* TopBar Persisten */}
      <TopBar currentRoute="projects" />

      {/* Modal Iframe Beranimasi Titik Kursor */}
      <IframeModal
        isOpen={modalState.isOpen}
        url={modalState.url}
        title={modalState.title}
        clickOrigin={modalState.clickOrigin}
        onClose={handleCloseIframe}
      />

      {/* Konten Utama */}
      <main className="w-full pt-[124px] pb-24 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-[960px] flex flex-col gap-6">
          {PUBLICATIONS_DATA.map((publication, idx) => (
            <PublicationRow
              key={publication.doi}
              item={publication}
              entranceDelay={80 + idx * 60}
              onOpenIframe={handleOpenIframe}
            />
          ))}
        </div>
      </main>
    </div>
  );
}