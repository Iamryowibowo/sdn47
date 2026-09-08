import { useState, useMemo, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase"; // sesuaikan path ke file konfigurasi Firebase kamu

/**
 * ============================================================================
 * DOKUMENTASI SAHABAT SEKOLAH DASAR
 * SDN 47 Kota Jambi
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// 1. HELPER: konversi url asli -> url embed
// ---------------------------------------------------------------------------
function cleanUrl(rawUrl) {
  if (!rawUrl) return "";
  const match = rawUrl.match(/https?:\/\/[^\s\]"]+/);
  return match ? match[0] : rawUrl;
}

function getYoutubeEmbed(url) {
  const clean = cleanUrl(url);
  const match = clean.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : "";
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function getYoutubeThumb(url) {
  const clean = cleanUrl(url);
  const match = clean.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : "";
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function getDriveEmbed(url) {
  const clean = cleanUrl(url);
  const match = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : "";
  return `https://drive.google.com/file/d/${id}/preview`;
}

function formatTanggal(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return dateStr;
  }
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
// 2. KARTU VIDEO (versi grid biasa)
// ---------------------------------------------------------------------------
function VideoCard({ video, onOpen }) {
  const meta = SOURCE_META[video.source] || SOURCE_META.youtube;
  const Icon = meta.icon;

  let thumbnail = video.thumbnail;
  if (!thumbnail && video.source === "youtube")
    thumbnail = getYoutubeThumb(video.url);

  return (
    <button
      onClick={() => onOpen(video)}
      className="group relative flex flex-col text-left rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
          <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md scale-90 group-hover:scale-100 transition-transform">
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
// 3. KARTU SOROTAN — dipakai di bagian "Postingan Terbaru"
// ---------------------------------------------------------------------------
function FeaturedCard({ video, onOpen }) {
  const meta = SOURCE_META[video.source] || SOURCE_META.youtube;
  const Icon = meta.icon;

  let thumbnail = video.thumbnail;
  if (!thumbnail && video.source === "youtube")
    thumbnail = getYoutubeThumb(video.url);

  return (
    <button
      onClick={() => onOpen(video)}
      className="group relative flex flex-col sm:flex-row w-full text-left rounded-2xl overflow-hidden bg-white border border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
// 4. MODAL PEMUTAR VIDEO
// ---------------------------------------------------------------------------
function VideoModal({ video, onClose }) {
  if (!video) return null;
  const meta = SOURCE_META[video.source] || SOURCE_META.youtube;
  const Icon = meta.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video bg-black">
          {video.source === "youtube" && (
            <iframe
              className="w-full h-full"
              src={getYoutubeEmbed(video.url) + "?autoplay=1"}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {video.source === "cloudinary" && (
            <video
              className="w-full h-full"
              src={video.url}
              controls
              autoPlay
            />
          )}
          {video.source === "drive" && (
            <iframe
              className="w-full h-full"
              src={getDriveEmbed(video.url)}
              title={video.title}
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
              {video.title}
            </h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              {video.description}
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
            href={cleanUrl(video.url)}
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
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [queryText, setQueryText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadFirebaseData() {
      try {
        console.log("Menghubungkan ke Firestore (koleksi: sahabat_videos)...");
        const qRef = query(
          collection(db, "sahabat_videos"),
          orderBy("date", "desc"),
        );
        const snap = await getDocs(qRef);

        console.log(`Berhasil mengambil ${snap.docs.length} dokumen.`);
        const dataList = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (mounted) {
          setVideos(dataList);
        }
      } catch (err) {
        console.error("Gagal mengambil data video dari Firestore:", err);
        if (mounted) {
          setErrorMsg(
            "Gagal memuat video dari database. Pastikan koneksi dan Rules Firestore sudah benar. (" +
              err.message +
              ")",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFirebaseData();

    return () => {
      mounted = false;
    };
  }, []);

  const latestVideo = useMemo(() => {
    if (videos.length === 0) return null;
    return [...videos].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [videos]);

  const filtered = useMemo(() => {
    const result = videos.filter((v) => {
      const matchSource = activeFilter === "all" || v.source === activeFilter;
      const matchQuery =
        queryText.trim() === "" ||
        (v.title || "").toLowerCase().includes(queryText.toLowerCase()) ||
        (v.category || "").toLowerCase().includes(queryText.toLowerCase());
      return matchSource && matchQuery;
    });

    result.sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [videos, activeFilter, queryText, sortOrder]);

  const counts = useMemo(() => {
    const c = { all: videos.length, youtube: 0, cloudinary: 0, drive: 0 };
    videos.forEach((v) => {
      if (c[v.source] !== undefined) c[v.source] += 1;
    });
    return c;
  }, [videos]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-slate-50 to-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Dokumentasi Sahabat Sekolah Dasar
          </span>

          <p className="text-slate-500 max-w-lg mt-3 text-[15px] leading-relaxed">
            Rekaman kegiatan program Sahabat Sekolah Dasar SDN 47 Kota Jambi —
            mulai dari pendampingan, kunjungan, hingga kolaborasi bersama
            sekolah.
          </p>
        </div>
      </section>

      {/* STATUS: loading */}
      {loading && (
        <div className="max-w-6xl mx-auto px-6 pt-10 flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          Memuat video dari database...
        </div>
      )}

      {/* STATUS: error */}
      {!loading && errorMsg && (
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold">Terjadi Kesalahan</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* POSTINGAN TERBARU */}
      {!loading && !errorMsg && latestVideo && (
        <section className="max-w-6xl mx-auto px-6 pt-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Postingan Terbaru
            </h2>
          </div>
          <FeaturedCard video={latestVideo} onOpen={setSelected} />
        </section>
      )}

      {/* KONTROL: pencarian + urutkan + filter sumber */}
      {!loading && !errorMsg && (
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Cari video..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Urutkan berdasarkan tanggal */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder("newest")}
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
                  onClick={() => setSortOrder("oldest")}
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
                  onClick={() => setActiveFilter(f.key)}
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
      )}

      {/* GRID VIDEO */}
      {!loading && !errorMsg && (
        <main className="max-w-6xl mx-auto px-6 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">
                Tidak ada video yang ditemukan.
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Pastikan koleksi{" "}
                <span className="font-mono text-indigo-600">
                  sahabat_videos
                </span>{" "}
                memiliki dokumen dengan field{" "}
                <span className="font-mono text-indigo-600">date</span> dan
                atribut yang sesuai.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((video) => (
                <VideoCard key={video.id} video={video} onOpen={setSelected} />
              ))}
            </div>
          )}
        </main>
      )}

      <VideoModal video={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
