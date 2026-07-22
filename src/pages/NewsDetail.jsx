import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-hot-toast";

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
        color: "bg-purple-50text-purple-700 border-purple-200",
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
          setNews({ id: docSnap.id, ...docSnap.data() });
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
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Layout Utama Grid: Kiri Konten, Kanan Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ================= KOLOM KIRI: KONTEN UTAMA ================= */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Header Berita */}
            <div className="space-y-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${badge.color}`}
              >
                <span>{badge.icon}</span>
                <span>{news.category || "Berita Sekolah"}</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight tracking-tight">
                {news.title}
              </h1>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-2 border-t border-slate-100">
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
            </div>

            {/* Gambar Utama */}
            {news.imageUrl && (
              <div className="w-full h-72 sm:h-[420px] rounded-2xl overflow-hidden shadow-md bg-slate-100">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Isi Konten Berita */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-normal text-base sm:text-lg">
              <p className="whitespace-pre-line">{news.content}</p>
            </div>

            {/* Bagian Bagikan / Share & Tombol Kembali */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>←</span> Kembali
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-bold text-slate-400 mr-2 hidden sm:inline">
                  Bagikan:
                </span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + " - " + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-200"
                  title="Bagikan ke WhatsApp"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200"
                  title="Bagikan ke Facebook"
                >
                  📘 Facebook
                </a>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-200"
                  title="Salin Tautan"
                >
                  🔗 Salin Link
                </button>
              </div>
            </div>
          </div>

          {/* ================= KOLOM KANAN: SIDEBAR BERITA LAINNYA ================= */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-950 uppercase tracking-tight text-sm flex items-center gap-2">
                  <span>🔥</span> Berita Lainnya
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Informasi dan kegiatan terkini sekolah
                </p>
              </div>

              <div className="space-y-4">
                {otherNews.length > 0 ? (
                  otherNews.map((item, index) => {
                    const itemBadge = getCategoryBadge(item.category);
                    return (
                      <Link
                        to={`/news/${item.id}`}
                        key={item.id}
                        className={`flex items-center gap-3.5 group p-2 rounded-2xl hover:bg-slate-50 transition-all ${
                          index !== otherNews.length - 1
                            ? "border-b border-slate-50 pb-4"
                            : ""
                        }`}
                      >
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/60">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="space-y-1.5 overflow-hidden">
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
