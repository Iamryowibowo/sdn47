import { useEffect, useRef, useState } from "react";
import { db } from "../config/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TimeAgo from "react-timeago";
import idStrings from "react-timeago/lib/language-strings/id";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { getCategoryBadge } from "../utils/categoryHelper";

gsap.registerPlugin(useGSAP);

const UPCOMING_AGENDAS = [
  {
    id: 1,
    date: "22",
    month: "JUN",
    title: "Hari Pertama Libur Semester Genap",
    time: "07.00 - Selesai",
    type: "Akademik",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: 2,
    date: "13",
    month: "JUL",
    title: "Permulaan Tahun Ajaran Baru 2026/2027",
    time: "07.00 - 11.00 WIB",
    type: "Wajib",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    date: "15",
    month: "JUL",
    title: "Masa Pengenalan Lingkungan Sekolah (MPLS) Kelas 1",
    time: "3 Hari Berturut",
    type: "Kegiatan",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

export default function News() {
  const containerRef = useRef();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatter = buildFormatter(idStrings);
  const [videosList, setVideosList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Berita
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setNewsList(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch Video
        const vidQ = query(
          collection(db, "videos"),
          orderBy("createdAt", "desc"),
        );
        const vidSnap = await getDocs(vidQ);
        setVideosList(
          vidSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredNews = newsList[0] || null;
  const regularNews = newsList.slice(1);

  // LOGIKA GSAP
  useGSAP(
    () => {
      if (loading) return;
      const tl = gsap.timeline();

      tl.fromTo(
        ".gsap-news-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );

      if (featuredNews) {
        tl.fromTo(
          ".gsap-news-spotlight",
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        );
      }

      if (regularNews.length > 0) {
        tl.fromTo(
          ".gsap-news-card",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        );
      } else {
        tl.fromTo(
          ".gsap-empty-state",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
          "-=0.4",
        );
      }

      tl.fromTo(
        ".gsap-agenda-item",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      );
    },
    { scope: containerRef, dependencies: [loading, newsList] },
  );

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen pt-24 pb-20 relative overflow-hidden"
    >
      <div className="absolute top-[10%] right-[-15%] w-150 h-150 bg-blue-200/20 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] left-[-15%] w-125 h-125 bg-indigo-200/20 rounded-full filter blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 space-y-16 relative z-10">
        {/* SECTION 1: HEADER TITLE */}
        <div className="gsap-news-header text-center lg:text-left space-y-2 max-w-2xl opacity-0">
          <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
            SCHOOL BULLETINS & EVENTS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Pusat Informasi &{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
              Kabar Sekolah
            </span>
          </h1>
          <p className="text-slate-500 font-light text-sm sm:text-base">
            Ikuti perkembangan prestasi, dokumentasi kegiatan terkini, beserta
            jadwal agenda penting akademik SDN 47 secara transparan.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse font-medium">
            Memuat Pusat Data Sekolah...
          </div>
        ) : featuredNews ? (
          <>
            {/* SECTION 2: TOP SPOTLIGHT (BERITA UTAMA & VIDEO) */}
            <section className="gsap-news-spotlight opacity-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* KOLOM KIRI: BERITA UTAMA (FEATURED NEWS) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div className="h-64 sm:h-80 overflow-hidden relative bg-slate-900 flex items-center justify-center">
                  {featuredNews.videoUrl ? (
                    // Cek apakah video berasal dari Cloudinary / file video langsung atau YouTube/Drive
                    featuredNews.videoUrl.includes("drive.google.com") ? (
                      <iframe
                        className="w-full h-full border-0"
                        src={featuredNews.videoUrl
                          .replace("/view?usp=sharing", "/preview")
                          .replace("/view", "/preview")}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={featuredNews.title}
                      />
                    ) : featuredNews.videoUrl.includes("youtube.com") ||
                      featuredNews.videoUrl.includes("youtu.be") ? (
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://www.youtube.com/embed/${
                          featuredNews.videoUrl.includes("youtu.be")
                            ? featuredNews.videoUrl
                                .split("/")
                                .pop()
                                .split("?")[0]
                            : featuredNews.videoUrl
                                .split("v=")[1]
                                ?.split("&")[0]
                        }`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={featuredNews.title}
                      />
                    ) : (
                      // Untuk Cloudinary atau file video langsung
                      <video
                        src={featuredNews.videoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain mx-auto"
                      />
                    )
                  ) : (
                    <img
                      src={featuredNews.imageUrl}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  {(() => {
                    const catName =
                      featuredNews.kategori ||
                      featuredNews.category ||
                      "BERITA";
                    const badge = getCategoryBadge(catName);
                    return (
                      <div
                        className={`absolute top-6 left-6 px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-md z-10 ${badge.color}`}
                      >
                        <span className="text-xs leading-none">
                          {badge.icon}
                        </span>
                        <span className="text-[10px] font-black tracking-widest uppercase leading-none">
                          {catName}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-6 sm:p-8 space-y-4 grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <span>📅 {featuredNews.dateString}</span>
                      <span>•</span>
                      <span>
                        ⏱️{" "}
                        {featuredNews.createdAt ? (
                          <TimeAgo
                            date={featuredNews.createdAt.toDate()}
                            formatter={formatter}
                          />
                        ) : (
                          "Beberapa saat lalu"
                        )}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {featuredNews.title}
                    </h2>

                    <div className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 space-y-2">
                      {featuredNews.content}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <Link
                      to={`/news/${featuredNews.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Baca Selengkapnya →
                    </Link>
                    <span className="text-slate-400 font-normal">
                      👁️ {featuredNews.views || 0} views
                    </span>
                  </div>
                </div>
              </div>

              {/* KANAN: Video Berita Terkini & Pembelajaran */}
              <div className="lg:col-span-5 space-y-6">
                {videosList.length > 0 ? (
                  <div className="bg-slate-950 rounded-4xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl pointer-events-none"></div>

                    <div className="space-y-2 relative z-10">
                      <span className="text-[9px] font-black tracking-widest bg-red-600 text-white px-2.5 py-0.5 rounded-md uppercase inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>{" "}
                        LATEST VIDEO
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-tight line-clamp-2">
                        {videosList[0].title}
                      </h3>
                    </div>

                    <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 my-6 overflow-hidden">
                      {videosList[0].videoUrl ? (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${
                            videosList[0].videoUrl.includes("youtu.be")
                              ? videosList[0].videoUrl.split("/").pop()
                              : videosList[0].videoUrl.split("v=")[1]
                          }`}
                          allowFullScreen
                          title="Featured Video"
                        />
                      ) : (
                        <img
                          src={videosList[0].thumbnailUrl}
                          className="w-full h-full object-cover"
                          alt="Featured Thumbnail"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-4xl p-8 text-slate-500 text-center">
                    Memuat video...
                  </div>
                )}

                {/* Daftar Video Pembelajaran */}
                {videosList.length > 1 && (
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black text-slate-950 uppercase text-xs tracking-widest">
                        Video Pembelajaran
                      </h4>
                      <Link
                        to="/videos"
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        LIHAT SEMUA →
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {videosList.slice(1, 3).map((vid) => {
                        const videoId =
                          vid.videoUrl && vid.videoUrl.includes("youtu.be")
                            ? vid.videoUrl.split("/").pop()
                            : vid.videoUrl
                              ? vid.videoUrl.split("v=")[1]
                              : "";

                        return (
                          <div
                            key={vid.id}
                            className="flex gap-4 items-center group bg-slate-50 p-3 rounded-2xl border border-slate-100"
                          >
                            <img
                              src={
                                vid.thumbnailUrl ||
                                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                              }
                              className="w-16 h-12 rounded-lg object-cover"
                              alt="thumbnail"
                            />
                            <div className="grow">
                              <h5 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {vid.title}
                              </h5>
                              <div className="flex gap-3 mt-1.5">
                                {vid.videoUrl && (
                                  <a
                                    href={vid.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[9px] text-blue-600 font-bold hover:underline"
                                  >
                                    WATCH
                                  </a>
                                )}
                                {vid.downloadUrl && (
                                  <a
                                    href={vid.downloadUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[9px] text-slate-500 font-bold hover:underline"
                                  >
                                    DOWNLOAD
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 3: SPLIT TWO-COLUMN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
              {/* KOLOM KIRI: ARSIP BERITA REGULAR */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                  Arsip Berita Terbaru
                </h3>

                {regularNews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {regularNews.map((news) => {
                      const categoryBadge = getCategoryBadge(
                        news.kategori || news.category || "BERITA",
                      );
                      return (
                        <div
                          key={news.id}
                          className="gsap-news-card opacity-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
                        >
                          <div className="h-44 bg-slate-100 overflow-hidden relative">
                            <img
                              src={news.imageUrl}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {(news.kategori || news.category) && (
                              <div
                                className={`absolute bottom-3 left-3 px-2 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm ${categoryBadge.color}`}
                              >
                                <span className="text-[10px] leading-none">
                                  {categoryBadge.icon}
                                </span>
                                <span className="text-[9px] font-black tracking-widest uppercase leading-none">
                                  {news.kategori || news.category}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-5 grow flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <div className="text-[10px] text-slate-400 font-medium flex justify-between items-center">
                                <span>📅 {news.dateString}</span>
                                <span>
                                  {news.createdAt ? (
                                    <TimeAgo
                                      date={news.createdAt.toDate()}
                                      formatter={formatter}
                                    />
                                  ) : (
                                    "Baru saja"
                                  )}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-950 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {news.title}
                              </h4>
                              <p className="text-slate-500 text-xs font-light line-clamp-2 leading-relaxed">
                                {news.content}
                              </p>
                            </div>
                            <Link
                              to={`/news/${news.id}`}
                              className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors pt-2 block border-t border-slate-50"
                            >
                              Selengkapnya →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="gsap-empty-state opacity-0 bg-white border border-dashed border-slate-300 rounded-4xl p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                    <span className="text-4xl">📭</span>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Belum Ada Arsip Tambahan
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Berita lama akan otomatis masuk dan tersusun di sini
                        apabila Anda menerbitkan lebih dari 1 berita.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: STICKY AGENDA */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                  Agenda Sekolah Terdekat
                </h3>

                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-4xl shadow-sm space-y-6">
                  {UPCOMING_AGENDAS.map((agenda) => (
                    <div
                      key={agenda.id}
                      className="gsap-agenda-item opacity-0 flex items-center gap-5 border-b border-slate-100 last:border-b-0 pb-5 last:pb-0 group"
                    >
                      <div className="w-16 h-16 bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-xl font-black tracking-tight leading-none">
                          {agenda.date}
                        </span>
                        <span className="text-[9px] font-bold text-blue-400 tracking-widest mt-1 leading-none">
                          {agenda.month}
                        </span>
                      </div>
                      <div className="space-y-1.5 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded border uppercase ${agenda.badgeColor}`}
                          >
                            {agenda.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            ⏱️ {agenda.time}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-950 text-xs sm:text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {agenda.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl text-center">
                  <p className="text-slate-600 text-xs font-light">
                    * Jadwal dapat berubah sewaktu-waktu. Wali murid akan
                    mendapatkan notifikasi surat edaran resmi via grup komite.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed rounded-4xl p-10 shadow-sm">
            <span className="text-4xl block mb-3">📰</span>
            <h4 className="font-bold text-slate-900">Belum ada publikasi</h4>
            <p className="text-slate-500 text-sm mt-1">
              Berita yang diterbitkan di panel admin akan muncul di halaman ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
