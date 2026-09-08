import { useState, useMemo, useRef } from "react";
import {
  Play,
  Video,
  Cloud,
  HardDrive,
  X,
  ExternalLink,
  Search,
  ArrowDownAZ,
  ArrowUpAZ,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * ============================================================================
 * DOKUMENTASI SAHABAT SEKOLAH DASAR
 * SDN 47 Kota Jambi
 * ============================================================================
 *
 * Halaman ini menampilkan video dari 3 sumber:
 *  1. YouTube   -> disimpan sebagai link (embed via iframe youtube-nocookie)
 *  2. Cloudinary-> disimpan sebagai link .mp4 (diputar dengan <video>)
 *  3. Google Drive -> disimpan sebagai link (embed via iframe /preview)
 *
 * Data VIDEO_DEMO di bawah adalah CONTOH. Di proyek aslimu, ganti dengan
 * data dari Firestore. Lihat blok "INTEGRASI FIRESTORE" di paling bawah file.
 *
 * Struktur dokumen Firestore yang disarankan (koleksi "videos"):
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   source: "youtube" | "cloudinary" | "drive",
 *   url: string,
 *   category: string,
 *   date: string,        // "2026-08-17"
 *   thumbnail?: string,  // opsional
 * }
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// 1. DATA CONTOH (ganti dengan data dari Firestore)
// ---------------------------------------------------------------------------
const VIDEO_DEMO = [
  {
    id: "1",
    title: "Upacara Bendera & Pengumuman Juara Lomba",
    description:
      "Dokumentasi upacara bendera hari Senin sekaligus penyerahan piala untuk siswa berprestasi.",
    source: "youtube",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    category: "Kegiatan",
    date: "2026-08-17",
  },
  {
    id: "2",
    title: "Festival Kuliner Nusantara SDN 47",
    description:
      "Keseruan siswa-siswi memperkenalkan makanan tradisional dari berbagai daerah di Indonesia.",
    source: "cloudinary",
    url: "https://res.cloudinary.com/demo/video/upload/v1690000000/sea_turtle.mp4",
    category: "Kegiatan",
    date: "2026-08-02",
  },
  {
    id: "3",
    title: "Latihan Pramuka Mingguan",
    description:
      "Rekaman kegiatan kepramukaan rutin setiap hari Jumat, disimpan di Google Drive sekolah.",
    source: "drive",
    url: "https://drive.google.com/file/d/1BxKM6M4T0hkq6XoTk5wl3f5nJgL7mYqZ/view",
    category: "Ekstrakurikuler",
    date: "2026-07-25",
  },
  {
    id: "4",
    title: "Cerdas Cermat Antar Kelas",
    description:
      "Kompetisi cerdas cermat tingkat sekolah dalam rangka Bulan Bahasa.",
    source: "youtube",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    category: "Akademik",
    date: "2026-07-10",
  },
  {
    id: "5",
    title: "Praktik IPA: Percobaan Gunung Meletus",
    description:
      "Video pembelajaran hasil praktik siswa kelas 5 pada mata pelajaran IPA.",
    source: "cloudinary",
    url: "https://res.cloudinary.com/demo/video/upload/v1690000000/elephants.mp4",
    category: "Pembelajaran",
    date: "2026-06-30",
  },
  {
    id: "6",
    title: "Wisuda & Perpisahan Kelas 6",
    description: "Momen haru pelepasan siswa kelas 6 tahun ajaran 2025/2026.",
    source: "drive",
    url: "https://drive.google.com/file/d/1CyMN7N5U1ilr7YpUl6xm4g6oKhM8nZrA/view",
    category: "Kegiatan",
    date: "2026-06-14",
  },
];

// ---------------------------------------------------------------------------
// 2. HELPER: konversi url asli -> url embed
// ---------------------------------------------------------------------------
function getYoutubeEmbed(url) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : "";
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function getYoutubeThumb(url) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function getDriveEmbed(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : "";
  return `https://drive.google.com/file/d/${id}/preview`;
}

function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SOURCE_META = {
  youtube: {
    label: "YouTube",
    icon: Video,
    color: "text-red-500",
    bg: "bg-red-50",
    ring: "ring-red-100",
  },
  cloudinary: {
    label: "Cloudinary",
    icon: Cloud,
    color: "text-sky-500",
    bg: "bg-sky-50",
    ring: "ring-sky-100",
  },
  drive: {
    label: "Google Drive",
    icon: HardDrive,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
};

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "youtube", label: "YouTube" },
  { key: "cloudinary", label: "Cloudinary" },
  { key: "drive", label: "Google Drive" },
];

// ---------------------------------------------------------------------------
// 3. KARTU VIDEO (versi grid biasa) — dengan micro-interaction GSAP di hover
// ---------------------------------------------------------------------------
function VideoCard({ video, onOpen, className = "" }) {
  const meta = SOURCE_META[video.source];
  const Icon = meta.icon;
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  let thumbnail = video.thumbnail;
  if (!thumbnail && video.source === "youtube")
    thumbnail = getYoutubeThumb(video.url);

  const handleEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, {
      scale: 1.12,
      duration: 0.35,
      ease: "back.out(2)",
    });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(iconRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <button
      ref={cardRef}
      onClick={() => onOpen(video)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`video-card group relative flex flex-col text-left rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
    >
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">
            <Icon className="w-10 h-10 text-white/70" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <span
            ref={iconRef}
            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md"
          >
            <Play className="w-5 h-5 text-indigo-600 fill-indigo-600 ml-0.5" />
          </span>
        </div>
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.color} ring-1 ${meta.ring}`}
        >
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] font-medium text-indigo-600">
          {video.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
          {video.description}
        </p>
        <span className="text-[11px] text-slate-400 mt-auto pt-2">
          {formatTanggal(video.date)}
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// 3b. KARTU SOROTAN — dipakai di bagian "Postingan Terbaru"
// ---------------------------------------------------------------------------
function FeaturedCard({ video, onOpen }) {
  const meta = SOURCE_META[video.source];
  const Icon = meta.icon;
  const cardRef = useRef(null);

  let thumbnail = video.thumbnail;
  if (!thumbnail && video.source === "youtube")
    thumbnail = getYoutubeThumb(video.url);

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -4, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.35, ease: "power2.out" });
  };

  return (
    <button
      ref={cardRef}
      onClick={() => onOpen(video)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="featured-card group relative flex flex-col sm:flex-row w-full text-left rounded-2xl overflow-hidden bg-white border border-indigo-100 shadow-sm hover:shadow-lg transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="relative sm:w-72 aspect-video sm:aspect-auto shrink-0 bg-slate-900 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">
            <Icon className="w-10 h-10 text-white/70" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
          <span className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-md scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4.5 h-4.5 text-indigo-600 fill-indigo-600 ml-0.5" />
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.color} ring-1 ${meta.ring}`}
          >
            <Icon className="w-3 h-3" />
            {meta.label}
          </span>
          <span className="text-[11px] font-medium text-indigo-600">
            {video.category}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {video.description}
        </p>
        <span className="text-[11px] text-slate-400 mt-auto pt-2">
          {formatTanggal(video.date)}
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// 4. MODAL PEMUTAR VIDEO — transisi masuk/keluar pakai GSAP
// ---------------------------------------------------------------------------
function VideoModal({ video, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [rendered, setRendered] = useState(video);

  // Simpan video terakhir supaya animasi keluar tetap punya konten saat video di-null-kan.
  // Pola resmi React: setState dipanggil langsung di badan komponen (bukan di useEffect),
  // dengan guard "video !== rendered" supaya tidak infinite loop. Ini menghindari
  // ESLint error react-hooks/set-state-in-effect.
  if (video && video !== rendered) {
    setRendered(video);
  }

  useGSAP(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (video) {
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
      );
    } else if (overlayRef.current.style.display !== "none") {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 16,
        scale: 0.97,
        duration: 0.22,
        ease: "power1.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [video]);

  if (!rendered) return null;
  const meta = SOURCE_META[rendered.source];
  const Icon = meta.icon;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
      style={{ display: "none" }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video bg-black">
          {rendered.source === "youtube" && (
            <iframe
              className="w-full h-full"
              src={getYoutubeEmbed(rendered.url) + "?autoplay=1"}
              title={rendered.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {rendered.source === "cloudinary" && (
            <video
              className="w-full h-full"
              src={rendered.url}
              controls
              autoPlay
            />
          )}
          {rendered.source === "drive" && (
            <iframe
              className="w-full h-full"
              src={getDriveEmbed(rendered.url)}
              title={rendered.title}
              allow="autoplay"
              allowFullScreen
            />
          )}
        </div>

        <div className="p-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${meta.bg} ${meta.color} ring-1 ${meta.ring} mb-2`}
            >
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {rendered.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              {rendered.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <a
            href={rendered.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Buka sumber asli <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. HALAMAN UTAMA
// ---------------------------------------------------------------------------
export default function Sahabat() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [selected, setSelected] = useState(null);

  const containerRef = useRef(null);
  const gridRef = useRef(null);

  // Postingan terbaru: 1 video dengan tanggal paling baru dari SELURUH data
  const latestVideo = useMemo(() => {
    return [...VIDEO_DEMO].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    )[0];
  }, []);

  const filtered = useMemo(() => {
    const result = VIDEO_DEMO.filter((v) => {
      const matchSource = activeFilter === "all" || v.source === activeFilter;
      const matchQuery =
        query.trim() === "" ||
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.category.toLowerCase().includes(query.toLowerCase());
      return matchSource && matchQuery;
    });

    result.sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [activeFilter, query, sortOrder]);

  const counts = useMemo(() => {
    const c = { all: VIDEO_DEMO.length, youtube: 0, cloudinary: 0, drive: 0 };
    VIDEO_DEMO.forEach((v) => (c[v.source] += 1));
    return c;
  }, []);

  // --- Animasi masuk halaman (hero, badge filter, featured card) ---
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".gsap-hero-badge",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      )
        .fromTo(
          ".gsap-hero-title",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".gsap-hero-desc",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.35",
        )
        .fromTo(
          ".gsap-section-label",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          "-=0.2",
        )
        .fromTo(
          ".featured-card",
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          ".gsap-controls",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  // --- Stagger animasi tiap kali grid berubah (filter/search/sort) ---
  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll(".video-card");
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        },
      );
    },
    { scope: gridRef, dependencies: [filtered] },
  );

  // --- Feedback kecil saat tombol filter ditekan ---
  const handleFilterClick = (key, e) => {
    setActiveFilter(key);
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
    );
  };

  const handleSortClick = (order, e) => {
    setSortOrder(order);
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <span className="gsap-hero-badge opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Dokumentasi Sahabat Sekolah Dasar
          </span>

          <p className="gsap-hero-desc opacity-0 text-slate-500 max-w-lg mt-3 text-[15px] leading-relaxed">
            Rekaman kegiatan program Sahabat Sekolah Dasar SDN 47 Kota Jambi —
            mulai dari pendampingan, kunjungan, hingga kolaborasi bersama
            sekolah.
          </p>
        </div>
      </section>

      {/* POSTINGAN TERBARU */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="gsap-section-label opacity-0 flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Postingan Terbaru
          </h2>
        </div>
        <FeaturedCard video={latestVideo} onOpen={setSelected} />
      </section>

      {/* KONTROL: pencarian + urutkan + filter sumber */}
      <div className="gsap-controls opacity-0 max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari video..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Urutkan berdasarkan tanggal */}
            <div className="flex gap-2">
              <button
                onClick={(e) => handleSortClick("newest", e)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  sortOrder === "newest"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                Terbaru
              </button>
              <button
                onClick={(e) => handleSortClick("oldest", e)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  sortOrder === "oldest"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                <ArrowUpAZ className="w-3.5 h-3.5" />
                Terlama
              </button>
            </div>
          </div>

          {/* Filter sumber */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={(e) => handleFilterClick(f.key, e)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  activeFilter === f.key
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 text-xs ${activeFilter === f.key ? "text-indigo-100" : "text-slate-400"}`}
                >
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID VIDEO */}
      <main ref={gridRef} className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">
              Tidak ada video yang cocok dengan pencarianmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onOpen={setSelected}
                className="opacity-0"
              />
            ))}
          </div>
        )}
      </main>

      <VideoModal video={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

/**
 * ============================================================================
 * INTEGRASI FIRESTORE (dipakai di proyek asli kamu)
 * ============================================================================
 *
 * import { collection, getDocs, query, orderBy } from "firebase/firestore";
 * import { db } from "./firebaseConfig";
 *
 * async function fetchVideos() {
 *   const q = query(collection(db, "videos"), orderBy("date", "desc"));
 *   const snap = await getDocs(q);
 *   return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
 * }
 *
 * Ganti VIDEO_DEMO dengan:
 *   const [videos, setVideos] = useState([]);
 *   useEffect(() => { fetchVideos().then(setVideos); }, []);
 * lalu pakai `videos` di seluruh file sebagai pengganti `VIDEO_DEMO`.
 * (Urutan default sudah "desc" dari Firestore, tombol Terbaru/Terlama
 * di halaman ini tetap bisa membalik urutan di sisi client.)
 * ============================================================================
 */
