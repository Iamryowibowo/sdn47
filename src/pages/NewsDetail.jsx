import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase"; // Sesuaikan path-nya

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Berita tidak ditemukan!");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <div className="pt-32 text-center">Memuat berita...</div>;
  if (!news)
    return <div className="pt-32 text-center">Berita tidak ditemukan.</div>;

  return (
    <div className="pt-32 pb-20 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Header Berita */}
      <div className="mb-8">
        <span className="text-blue-600 font-black tracking-widest uppercase text-xs">
          {news.category || "Berita Sekolah"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 mt-4 leading-tight">
          {news.title}
        </h1>
        <p className="text-slate-500 mt-4 text-sm">{news.dateString}</p>
      </div>

      {/* Gambar Utama */}
      {news.imageUrl && (
        <div className="w-full h-64 sm:h-[400px] rounded-[32px] overflow-hidden mb-10 shadow-lg">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Konten Berita */}
      <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
        {/* Menggunakan whitespace-pre-line agar enter di database tetap terbaca */}
        <p className="whitespace-pre-line">{news.content}</p>
      </div>

      {/* Tombol Back */}
      <button
        onClick={() => window.history.back()}
        className="mt-12 px-6 py-2 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
