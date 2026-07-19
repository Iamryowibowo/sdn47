import { useRef, useState, useEffect } from "react"; // 1. Tambahkan useState & useEffect
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase"; // 2. Tambahkan import db (Firestore)
import { collection, getDocs } from "firebase/firestore"; // 3. Import modul Firestore
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dashboardRef = useRef();

  // State untuk menampung jumlah data statistik secara real
  const [stats, setStats] = useState({
    totalNews: 0,
    totalGallery: 0,
    totalAgenda: 3, // Sementara kita taruh placeholder dulu
  });

  // ----- AMBIL DATA STATISTIK DARI FIRESTORE -----
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // A. Ambil total dokumen dari koleksi "news"
        const newsSnapshot = await getDocs(collection(db, "news"));

        // B. Ambil total dokumen dari koleksi "gallery" (antisipasi kalau nanti dibuat)
        const gallerySnapshot = await getDocs(collection(db, "gallery")).catch(
          () => ({ size: 0 }),
        );

        setStats({
          totalNews: newsSnapshot.size,
          totalGallery: gallerySnapshot.size,
          totalAgenda: 3, // Tetap 3 dulu sesuai request bertahap
        });
      } catch (error) {
        console.error("Gagal mengambil data statistik dashboard:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  // ----- ANIMASI GSAP DASHBOARD -----
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // 1. Munculkan Sidebar dari kiri & Main Content fade-in
      tl.from(".gsap-sidebar", {
        x: -80,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      tl.from(
        ".gsap-content-head",
        { y: -20, opacity: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3",
      );

      // 2. Stagger / Masuk berurutan untuk kartu statistik
      tl.from(
        ".gsap-stat-card",
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.2",
      );
    },
    { scope: dashboardRef },
  );

  // Fungsi untuk Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin"); // Lempar kembali ke halaman login
    } catch {
      alert("Gagal keluar, coba lagi.");
    }
  };

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800"
    >
      {/* SIDEBAR (Nuansa Biru Gelap Enterprise) */}
      <aside className="gsap-sidebar w-full md:w-64 bg-slate-900 text-white flex flex-col p-6 space-y-8 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
            47
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Admin SDN 47</h1>
            <p className="text-xs text-blue-400 font-medium">
              Status: Super Admin
            </p>
          </div>
        </div>

        {/* Menu Navigasi Internal Admin */}
        <nav className="grow space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all"
          >
            <span className="text-sm">Dashboard Utama</span>
          </Link>
          <Link
            to="/admin/news"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <span className="text-sm">Kelola Berita</span>
          </Link>

          <Link
            to="/admin/video"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <span className="text-sm">Kelola Video</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <span className="text-sm">Kelola Galeri</span>
          </Link>
          <Link
            to="/admin/content"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
          >
            <span className="text-sm">Informasi Sekolah</span>
          </Link>
        </nav>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-red-500/20"
        >
          Keluar Aplikasi
        </button>
      </aside>

      {/* KONTEN UTAMA (Nuansa Putih Bersih) */}
      <main className="grow p-8 lg:p-12 space-y-8 overflow-y-auto">
        {/* Header Konten */}
        <div className="gsap-content-head flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Selamat Datang di Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Berikut adalah ringkasan data dan konten Website SDN 47 saat ini.
            </p>
          </div>
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-600 shadow-sm self-start">
            👋 Halo, Admin
          </div>
        </div>

        {/* GRID KARTU STATISTIK (GSAP Staggered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kartu 1: Berita */}
          <div className="gsap-stat-card bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Total Berita
              </span>
              <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs">
                Aktif
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalNews}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Artikel dipublikasi
              </span>
            </div>
          </div>

          {/* Kartu 2: Galeri */}
          <div className="gsap-stat-card bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Foto Galeri
              </span>
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs">
                Media
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalGallery}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                File dokumentasi
              </span>
            </div>
          </div>

          {/* Kartu 3: Agenda Kegiatan */}
          <div className="gsap-stat-card bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Agenda Terdekat
              </span>
              <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs">
                Kalender
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalAgenda}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Acara sekolah aktif
              </span>
            </div>
          </div>
        </div>

        {/* AREA INFORMASI BANTUAN */}
        <div className="gsap-stat-card bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">
              Butuh bantuan pengelolaan sistem?
            </h3>
            <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
              Kamu bisa menambah, mengubah, atau menghapus informasi publik
              sekolah melalui menu navigasi di bilah samping kiri secara
              langsung.
            </p>
          </div>
          <Link
            to="/admin/news"
            className="px-6 py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl text-sm shadow-md transition-colors whitespace-nowrap text-center"
          >
            Mulai Kelola Berita
          </Link>
        </div>
      </main>
    </div>
  );
}
