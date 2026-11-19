import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { db } from "../config/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

gsap.registerPlugin(useGSAP);

export default function TeacherStaff() {
  const containerRef = useRef();
  const [activeFilter, setActiveFilter] = useState("all");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data realtime dari Firestore (diisi lewat halaman admin)
  useEffect(() => {
    const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setStaffList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  const filteredStaff =
    activeFilter === "all"
      ? staffList
      : staffList.filter((item) => item.category === activeFilter);

  // Animasi header: sekali saat halaman dibuka
  useGSAP(
    () => {
      gsap.from(".gsap-teacher-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  // Animasi kartu: ulang saat filter berubah atau data selesai dimuat
  useGSAP(
    () => {
      if (loading) return;
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
    },
    {
      scope: containerRef,
      dependencies: [activeFilter, loading, staffList.length],
    },
  );

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden pt-24 pb-20"
    >
      <div className="absolute top-[10%] left-[-10%] w-150 h-150 bg-blue-100/40 rounded-full filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-125 h-125 bg-indigo-100/40 rounded-full filter blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 relative z-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="gsap-teacher-title text-xs font-black text-blue-600 tracking-widest uppercase block">
            SDN 47 HUMAN RESOURCES
          </span>
          <h1 className="gsap-teacher-title text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Kenali Lebih Dekat <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
              Tenaga Pendidik Kami
            </span>
          </h1>
          <p className="gsap-teacher-title text-slate-600 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Dipimpin oleh para profesional yang berdedikasi tinggi, seluruh
            jajaran guru dan staff kami siap memberikan bimbingan akademis serta
            pengasuhan karakter terbaik untuk buah hati Anda.
          </p>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="gsap-teacher-card bg-white border border-slate-200/80 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="h-64 bg-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <img
                  src={staff.imageUrl}
                  alt={staff.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <span className="absolute top-4 left-4 z-20 text-[9px] font-black tracking-widest bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-slate-800 uppercase shadow-sm">
                  {staff.category === "pimpinan"
                    ? "👑 Core"
                    : staff.category === "guru"
                      ? "📖 Educator"
                      : "⚙️ Ops"}
                </span>
              </div>

              <div className="p-6 space-y-4 grow flex flex-col justify-between bg-white">
                <div className="space-y-1">
                  <h3 className="font-black text-slate-950 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold tracking-wide uppercase">
                    {staff.role}
                  </p>
                </div>

                {staff.quote && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-slate-500 text-xs font-light italic leading-relaxed line-clamp-2">
                      "{staff.quote}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12 text-slate-400 text-sm font-light">
            Memuat data personel...
          </div>
        )}

        {!loading && filteredStaff.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm font-light">
            Tidak ada data personel untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
