import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// =========================================================
// MOCK DATA GURU & STAFF (Gampang diedit/diintegrasikan ke Database)
// =========================================================
const STAFF_DATA = [
  {
    id: 1,
    name: "Nama Kepala Sekolah, M.Pd.",
    role: "Kepala Sekolah",
    category: "pimpinan",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    quote: "Mendidik dengan hati, mengajar dengan inovasi.",
  },
  {
    id: 2,
    name: "Drs. Ahmad Subarkah",
    role: "Wakil Kepala Sekolah & Kurikulum",
    category: "pimpinan",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    quote: "Menyusun fondasi belajar terbaik bagi masa depan anak.",
  },
  {
    id: 3,
    name: "Siti Rahmawati, S.Pd.",
    role: "Wali Kelas VI A",
    category: "guru",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    quote: "Nalar kritis dimulai dari ruang kelas yang merdeka.",
  },
  {
    id: 4,
    name: "Budi Utomo, S.Pd.",
    role: "Wali Kelas V B",
    category: "guru",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    quote: "Disiplin adalah kunci kemandirian belajar.",
  },
  {
    id: 5,
    name: "Rina Permata, S.Pd.Jas",
    role: "Guru PJOK / Olahraga",
    category: "guru",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    quote: "Tubuh yang sehat melahirkan jiwa yang kuat!",
  },
  {
    id: 6,
    name: "Hendra Wijaya, S.Kom",
    role: "Kepala Tata Usaha & IT Operator",
    category: "staff",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    quote: "Menjamin kelancaran sistem informasi & administrasi sekolah.",
  },
  {
    id: 7,
    name: "Dewi Lestari, A.Md.",
    role: "Staf Administrasi & Keuangan",
    category: "staff",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    quote: "Pelayanan transparan dan ramah untuk seluruh wali murid.",
  },
];

export default function TeacherStaff() {
  const containerRef = useRef();
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter Logic
  const filteredStaff =
    activeFilter === "all"
      ? STAFF_DATA
      : STAFF_DATA.filter((item) => item.category === activeFilter);

  // ----- GSAP ANIMATION TUNING -----
  useGSAP(() => {
    // Reveal text Header awal
    gsap.from(".gsap-teacher-title", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animasi Stagger kartu-kartu guru setiap kali filter berubah
    gsap.fromTo(
      ".gsap-teacher-card",
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }, [activeFilter]); // Triggers animation ulang tiap filter di-klik

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden pt-24 pb-20"
    >
      {/* BACKGROUND AMBIENT DECORATION */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full filter blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 relative z-10 space-y-16">
        {/* ==========================================
            SECTION 1: TITLE & HEADER INTRO
           ========================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="gsap-teacher-title text-xs font-black text-blue-600 tracking-widest uppercase block">
            SDN 47 HUMAN RESOURCES
          </span>
          <h1 className="gsap-teacher-title text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Kenali Lebih Dekat <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Tenaga Pendidik Kami
            </span>
          </h1>
          <p className="gsap-teacher-title text-slate-600 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Dipimpin oleh para profesional yang berdedikasi tinggi, seluruh
            jajaran guru dan staff kami siap memberikan bimbingan akademis serta
            pengasuhan karakter terbaik untuk buah hati Anda.
          </p>
        </div>

        {/* ==========================================
            SECTION 2: INTERACTIVE FILTER NAVIGATION
           ========================================== */}
        <div className="flex flex-wrap justify-center items-center gap-3 border-b border-slate-200/60 pb-6">
          {[
            { id: "all", label: "Semua Personel" },
            { id: "pimpinan", label: "Struktural / Pimpinan" },
            { id: "guru", label: "Guru Pengajar" },
            { id: "staff", label: "Staff & Tata Usaha" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all border ${
                activeFilter === btn.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10 scale-102"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ==========================================
            SECTION 3: CARDS GRID INTERACTIVE
           ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="gsap-teacher-card bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              {/* Image Container with Luxury Zoom Hover */}
              <div className="h-64 bg-slate-100 overflow-hidden relative">
                {/* Overlay subtle shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Badge Kategori Kecil Pojok Kiri */}
                <span className="absolute top-4 left-4 z-20 text-[9px] font-black tracking-widest bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-slate-800 uppercase shadow-sm">
                  {staff.category === "pimpinan"
                    ? "👑 Core"
                    : staff.category === "guru"
                      ? "📖 Educator"
                      : "⚙️ Ops"}
                </span>
              </div>

              {/* Info Detail Content */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between bg-white">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-950 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold tracking-wide uppercase">
                    {staff.role}
                  </p>
                </div>

                {/* Staff Quote Section (Membuat Hawa Lebih Humanis) */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-slate-500 text-xs font-light italic leading-relaxed line-clamp-2">
                    "{staff.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CONDITION JIKA DATA KOSONG (FALLBACK) */}
        {filteredStaff.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-light">
            Tidak ada data personel untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
