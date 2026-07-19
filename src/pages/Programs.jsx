import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Data Pembiasaan Harian (Senin - Jumat)
const WEEKLY_HABITS = [
  {
    day: "Senin",
    title: "Nasionalisme & Literasi",
    activities: [
      {
        time: "07.00 - 08.00",
        task: "Upacara Bendera Khidmat & Apresiasi Prestasi Siswa",
      },
    ],
    color: "from-blue-600 to-blue-700",
  },
  {
    day: "Selasa",
    title: "kesehatan & Karakter",
    activities: [
      {
        time: "07.00 - 07.30",
        task: "Senam Pagi & Pembiasaan Karakter (Kedisiplinan, Toleransi, dll)",
      },
    ],
    color: "from-indigo-600 to-indigo-700",
  },
  {
    day: "Rabu",
    title: "Pramuka & Kepemimpinan",
    activities: [
      {
        time: "07.00 - 07.30",
        task: "Pramuka",
      },
    ],
    color: "from-purple-600 to-purple-700",
  },
  {
    day: "Kamis",
    title: "Budaya lokal & Kreativitas",
    activities: [
      {
        time: "07.00 - 07.30",
        task: "Literasi Budaya & Kegiatan Kreatif (Seni, Musik, dll)",
      },
    ],
    color: "from-amber-600 to-amber-700",
  },
  {
    day: "Jumat",
    title: "Spiritual",
    activities: [
      {
        time: "07.00 - 07.45",
        task: "Membaca Kitab Suci & Doa Bersama (Kebersamaan & toleransi)",
      },
    ],
    color: "from-emerald-600 to-emerald-700",
  },
];

// Data Ekstrakurikuler
const EXTRACT_DATA = [
  {
    id: 1,
    name: "Pramuka Inti",
    icon: "⛺",
    desc: "Melatih kemandirian, kepemimpinan, dan ketangkasan luar ruangan.",
  },
  {
    id: 2,
    name: "Klub Musik Kompangan",
    icon: "🪘",
    desc: "Eksplorasi ketukan musik tradisional Jambi lewat latihan rebana dan lagu islami/melayu.",
  },
  {
    id: 3,
    name: "Paduan Suara & Musik",
    icon: "🎵",
    desc: "Mengembangkan bakat olah vokal dan harmonisasi instrumen musik.",
  },
  {
    id: 4,
    name: "Dokter Kecil (PMR)",
    icon: "🩺",
    desc: "Edukasi kesehatan dini, pertolongan pertama, dan kepedulian sosial.",
  },
  {
    id: 5,
    name: "Futsal & Atletik",
    icon: "⚽",
    desc: "Pembinaan prestasi olahraga, kerja sama tim, dan fisik prima.",
  },
  {
    id: 6,
    name: "Seni Tari Tradisional",
    icon: "🩰",
    desc: "Pelestarian budaya Nusantara melalui olah gerak tari kreasi daerah.",
  },
];

export default function Programs() {
  const containerRef = useRef();
  const [activeDay, setActiveDay] = useState(0);

  // Animate content saat ganti tab hari
  useGSAP(() => {
    gsap.fromTo(
      ".gsap-timeline-card",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [activeDay]);

  useGSAP(
    () => {
      gsap.from(".gsap-ac-fade", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen pt-24 pb-20 relative overflow-hidden"
    >
      {/* GLOW DECORATION */}
      <div className="absolute top-[5%] left-[-15%] w-150 h-150 bg-blue-200/30 rounded-full filter blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-150 h-150 bg-indigo-200/30 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 space-y-28 relative z-10">
        {/* ==========================================
            SECTION 1: HEADER TITLE
           ========================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="gsap-ac-fade text-xs font-black text-blue-600 tracking-widest uppercase block">
            CURRICULUM & ECOSYSTEM
          </span>
          <h1 className="gsap-ac-fade text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Program Akademik & <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
              Pengembangan Bakat
            </span>
          </h1>
          <p className="gsap-ac-fade text-slate-600 font-light text-sm sm:text-base max-w-xl mx-auto">
            Struktur pembelajaran komprehensif yang dirancang seimbang antara
            kecerdasan kognitif, kebiasaan karakter luhur, dan sarana prasarana
            modern.
          </p>
        </div>

        {/* ==========================================
            SECTION 2: PEMBIASAAN SENIN - JUMAT (INTERACTIVE PATH)
           ========================================== */}
        <section className="space-y-8 bg-white border border-slate-200/80 p-6 sm:p-10 rounded-4xl shadow-sm">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
              DAILY ROUTINES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Kultur Pembiasaan Mingguan
            </h2>
          </div>

          {/* Navigation Tabs Hari */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {WEEKLY_HABITS.map((item, idx) => (
              <button
                key={item.day}
                onClick={() => setActiveDay(idx)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeDay === idx
                    ? "bg-slate-950 text-white shadow-sm"
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item.day}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="gsap-timeline-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Sisi Kiri: Banner Hari */}
            <div
              className={`lg:col-span-4 p-8 rounded-2xl bg-linear-to-br ${WEEKLY_HABITS[activeDay].color} text-white space-y-2 shadow-md`}
            >
              <span className="text-[10px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md uppercase">
                FOKUS HARI
              </span>
              <h3 className="text-3xl font-black tracking-tight">
                {WEEKLY_HABITS[activeDay].day}
              </h3>
              <p className="text-sm font-light text-blue-50 leading-relaxed pt-2">
                Tema pengembangan: <br />
                <strong>{WEEKLY_HABITS[activeDay].title}</strong>
              </p>
            </div>

            {/* Sisi Kanan: Poin Kegiatan */}
            <div className="lg:col-span-8 space-y-4">
              <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                Rangkaian Aktivitas Pagi
              </h4>
              <div className="space-y-3">
                {WEEKLY_HABITS[activeDay].activities.map((act, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 items-start"
                  >
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100/40 whitespace-nowrap mt-0.5">
                      {act.time}
                    </span>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      {act.task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 3: FASILITAS SEKOLAH (BRIGHT BENTO SHOWCASE)
           ========================================== */}
        <section className="space-y-12 py-20">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
              INFRASTRUCTURE
            </span>
            <h2 className="text-4xl font-black text-slate-950 tracking-tight">
              Sarana & Fasilitas
            </h2>
          </div>

          {/* Bento Grid Layout - Visual Menarik dengan Gambar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
            {/* 1. Arena Tradisional (Besar - Dominan) */}
            <div className="md:col-span-2 md:row-span-2 rounded-4xl overflow-hidden relative group shadow-sm border border-slate-200">
              <img
                src="https://res.cloudinary.com/dkcoq6uge/image/upload/v1784471908/lapangan_1_yqggoc.png"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent p-8 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-black">
                  Arena Permainan Tradisional
                </h3>
                <p className="text-slate-300 text-sm font-medium">
                  Lapangan dengan lantai lukis untuk eksplorasi budaya.
                </p>
              </div>
            </div>

            {/* 2. Perpustakaan */}
            <div className="md:col-span-2 rounded-4xl overflow-hidden relative group shadow-sm border border-slate-200">
              <img
                src="https://res.cloudinary.com/dkcoq6uge/image/upload/v1784471908/perpustakaan_1_jn5dox.png"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent p-6 flex flex-col justify-end text-white">
                <h4 className="font-bold">Perpustakaan Literasi</h4>
              </div>
            </div>

            {/* 3. Fasilitas Lainnya (Grid Kecil) */}
            {[
              {
                title: "Kelas Ergonomis",
                img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400",
              },
              {
                title: "Mushola",
                img: "https://res.cloudinary.com/dkcoq6uge/image/upload/v1784471907/tahdfidz_1_nvxrll.png",
              },
              {
                title: "Kantin Sehat",
                img: "https://res.cloudinary.com/dkcoq6uge/image/upload/v1784471908/kantin_1_fxnjbd.png",
              },
              {
                title: "Koperasi",
                img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=400",
              },
              {
                title: "UKS",
                img: "https://res.cloudinary.com/dkcoq6uge/image/upload/v1781978160/cld-sample-5.jpg",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-4xl overflow-hidden relative group shadow-sm border border-slate-200"
              >
                <img
                  src={f.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black opacity-0 group-hover:opacity-100 transition-opacity">
                  {f.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 4: EKSTRAKURIKULER (TALENT BOARD)
           ========================================== */}
        <section className="space-y-12">
          <div className="text-center lg:text-left space-y-1">
            <span className="text-xs font-black text-amber-600 tracking-widest uppercase block">
              TALENT DEVELOPMENTS
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Wahana Ekstrakurikuler
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTRACT_DATA.map((eskul) => (
              <div
                key={eskul.id}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 items-start group"
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                  {eskul.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-950 text-base tracking-tight group-hover:text-blue-600 transition-colors">
                    {eskul.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    {eskul.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
