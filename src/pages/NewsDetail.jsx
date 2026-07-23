import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Fungsi Helper untuk Badge Kategori
const getCategoryBadge = (category) => {
  const cat = category?.toUpperCase();
  switch (cat) {
    case "PRESTASI":
      return {
        icon: "⭐",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "PENGUMUMAN":
      return {
        icon: "📢",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "KEGIATAN":
      return {
        icon: "🏆",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "AKADEMIK":
      return {
        icon: "📚",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      };
    case "EKSTRAKURIKULER":
      return {
        icon: "⚽",
        color: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "ARTIKEL":
      return {
        icon: "✍️",
        color: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        icon: "📰",
        color: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

export default function NewsDetail() {
  const { id } = useParams();
  const containerRef = useRef();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const newsData = docSnap.data();
          const currentViews =
            typeof newsData.views === "number" ? newsData.views : 0;

          setNews({ id: docSnap.id, ...newsData, views: currentViews });

          const viewedKey = `viewed_news_${id}`;
          const hasViewed = localStorage.getItem(viewedKey);

          if (!hasViewed) {
            await updateDoc(docRef, {
              views: increment(1),
            });
            localStorage.setItem(viewedKey, "true");
            setNews((prev) => ({ ...prev, views: currentViews + 1 }));
          }
        } else {
          console.log("Berita tidak ditemukan!");
        }

        const q = query(
          collection(db, "news"),
          orderBy("createdAt", "desc"),
          limit(5),
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.id !== id);

        setOtherNews(list.slice(0, 4));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
    window.scrollTo(0, 0);
  }, [id]);

  // LOGIKA GSAP ANIMASI MASUK
  useGSAP(
    () => {
      if (loading) return;

      const tl = gsap.timeline();

      // Animasi Konten Utama di Kiri
      tl.fromTo(
        ".gsap-news-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      );

      // Animasi Sidebar di Kanan secara berurutan (stagger)
      tl.fromTo(
        ".gsap-sidebar-item",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    },
    { scope: containerRef, dependencies: [loading, news] },
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan berita berhasil disalin!");
  };

  if (loading)
    return (
      <div className="min-h-screen pt-40 text-center text-slate-400 font-medium">
        Memuat berita...
      </div>
    );
  if (!news)
    return (
      <div className="min-h-screen pt-40 text-center text-slate-400 font-medium">
        Berita tidak ditemukan.
      </div>
    );

  const badge = getCategoryBadge(news.category);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50/50 pt-8 pb-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI: KONTEN UTAMA */}
          <div className="lg:col-span-8 gsap-news-content opacity-0 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${badge.color}`}
              >
                <span>{badge.icon}</span>
                <span>{news.category || "Berita Sekolah"}</span>
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-snug tracking-tight">
                {news.title}
              </h1>

              {/* Info Tanggal & Views */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-400 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span>Dipublikasikan pada</span>
                  <span>•</span>
                  <span>
                    {news.createdAt?.toDate
                      ? news.createdAt.toDate().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Baru saja"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                  <span>👁️</span>
                  <span>{news.views || 0} Dilihat</span>
                </div>
              </div>
            </div>

            {/* Media Utama: Otomatis mendeteksi Video (YouTube/GDrive) atau Foto */}
            {(news.videoUrl || news.imageUrl) && (
              <div className="w-full h-64 sm:h-95 rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                {news.videoUrl ? (
                  <iframe
                    className="w-full h-full object-cover"
                    src={
                      news.videoUrl.includes("drive.google.com")
                        ? news.videoUrl
                            .replace("/view?usp=sharing", "/preview")
                            .replace("/view", "/preview")
                        : `https://www.youtube.com/embed/${
                            news.videoUrl.includes("youtu.be")
                              ? news.videoUrl.split("/").pop().split("?")[0]
                              : news.videoUrl.split("v=")[1]?.split("&")[0]
                          }`
                    }
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={news.title}
                  />
                ) : (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                  />
                )}
              </div>
            )}

            {/* Isi Konten Berita (Pecah Paragraf Otomatis) */}
            <div className="text-slate-700 leading-relaxed font-normal text-justify sm:text-lg space-y-4">
              {news.content
                .split(/(?<=[.!?])\s+/)
                .reduce((acc, sentence, index) => {
                  const paragraphIndex = Math.floor(index / 3);
                  if (!acc[paragraphIndex]) acc[paragraphIndex] = [];
                  acc[paragraphIndex].push(sentence);
                  return acc;
                }, [])
                .map((paragraphSentences, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraphSentences.join(" ")}
                  </p>
                ))}
            </div>

            {/* Tombol Share & Kembali */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/news"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>←</span> Kembali ke Berita
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">
                  Bagikan:
                </span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + " - " + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-200"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200"
                >
                  📘 Facebook
                </a>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200"
                >
                  🔗 Salin Link
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SIDEBAR BERITA LAINNYA */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="gsap-sidebar-item opacity-0 bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-950 uppercase tracking-tight text-sm flex items-center gap-2">
                  <span>🔥</span> Berita Lainnya
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informasi dan kegiatan terkini sekolah
                </p>
              </div>

              <div className="space-y-3">
                {otherNews.length > 0 ? (
                  otherNews.map((item, index) => {
                    const itemBadge = getCategoryBadge(item.category);
                    return (
                      <Link
                        to={`/news/${item.id}`}
                        key={item.id}
                        className={`gsap-sidebar-item flex items-center gap-3 group p-2 rounded-2xl hover:bg-slate-50 transition-all ${
                          index !== otherNews.length - 1
                            ? "border-b border-slate-50 pb-3"
                            : ""
                        }`}
                      >
                        {item.imageUrl && (
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="space-y-1 overflow-hidden">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-md inline-block border uppercase ${itemBadge.color}`}
                          >
                            {item.category || "Berita"}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Belum ada berita lainnya.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
