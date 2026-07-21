import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import kepsek from "../assets/images/KEPSEK.jpeg";

// Register ScrollTrigger untuk efek Parallax & Animasi
gsap.registerPlugin(useGSAP, ScrollTrigger);

// ==========================================
// DATA UTAMA PROGRAM UNGGULAN
// ==========================================
const programs = [
  {
    title: "LENTERA",
    image: "/lentera.png",
    desc: "Literasi dan Numerasi Terencana untuk meraih prestasi. Pembelajaran bermakna, menyenangkan, dan berkelanjutan untuk prestasi akademik gemilang.",
    badge: "Akademik",
  },
  {
    title: "BERANI",
    image: "/berani.png",
    desc: "Bebas Perundungan, Edukatif, Ramah, Aman, dan Inklusif. Menciptakan budaya saling menghargai dan lingkungan belajar yang nyaman bagi siswa.",
    badge: "Karakter",
  },
  {
    title: "BERKAH",
    image: "/berkah.png",
    desc: "Beriman, Berkarakter Mulia, Berakhlak, dan Harmonis. Menanamkan nilai keimanan dan membentuk karakter mulia bagi seluruh warga sekolah.",
    badge: "Religius",
  },
  {
    title: "SAHABAT",
    image: "/sahabat.png",
    desc: "Sinergi Antara Home (Rumah). Kolaborasi aktif sekolah, orang tua, dan masyarakat untuk mendampingi tumbuh kembang anak.",
    badge: "Kolaborasi",
  },
  {
    title: "TEPAT",
    image: "/tepat.png",
    desc: "Teknologi Pembelajaran Aktif dan Transformatif. Memanfaatkan teknologi untuk pembelajaran aktif, kreatif, dan siap menghadapi transformasi digital.",
    badge: "Teknologi",
  },
  {
    title: "BESTARI",
    image: "/bestari.png",
    desc: "Bawa Wadah, Entaskan Sampah, Tanamkan Aksi Resik dan Indah. Membudayakan aksi resik, mengurangi sampah plastik, dan menjaga kelestarian lingkungan.",
    badge: "Lingkungan",
  },
  {
    title: "GEMILANG",
    image: "/gemilang.png",
    desc: "Generasi Edukatif, Mandiri, Inovatif, Literatif, Adaptif, dan Gemar Berprestasi. Membentuk karakter unggul yang siap bersaing dan berprestasi tinggi.",
    badge: "Prestasi",
  },
];

export default function About() {
  // ==========================================
  // REFS & STATES
  // ==========================================
  const containerRef = useRef();
  const videoSectionRef = useRef();
  const missionRef = useRef(null);

  // State & Ref untuk Pie Slider Program Unggulan
  const wheelRef = useRef(null);
  const sliderSectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = programs.length;
  const angleStep = 360 / totalItems;

  // ==========================================
  // GSAP: ANIMASI ROTASI PIE SLIDER
  // ==========================================
  useGSAP(
    () => {
      const targetRotation = -activeIndex * angleStep;

      gsap.to(wheelRef.current, {
        rotation: targetRotation,
        duration: 1,
        ease: "power3.inOut",
      });

      gsap.to(".wheel-item", { scale: 0.8, opacity: 0.6, duration: 0.5 });
      gsap.to(`.wheel-item-${activeIndex}`, {
        scale: 1.1,
        opacity: 1,
        duration: 0.5,
      });

      gsap.fromTo(
        ".content-panel",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2 },
      );
    },
    { dependencies: [activeIndex], scope: sliderSectionRef },
  );

  // Auto rotate pie slider setiap 6 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalItems]);

  // Data Misi Sekolah
  const missions = [
    "Membentuk murid yang beriman, bertakwa kepada Tuhan Yang Maha Esa, berakhlak mulia, serta membiasakan pengamalan nilai-nilai keagamaan dalam kehidupan sehari-hari.",
    "Menyelenggarakan pembelajaran mendalam (Deep Learning) yang berkesadaran (mindful), bermakna (meaningful), dan menggembirakan (joyful) sehingga murid mampu memahami konsep secara utuh.",
    "Menanamkan karakter mandiri, disiplin, tanggung jawab, integritas, dan kepedulian sosial melalui pembelajaran dan pembiasaan positif di lingkungan sekolah.",
    "Meningkatkan kualitas pembelajaran yang berpusat pada murid melalui penerapan metode, model, media, dan teknologi pembelajaran yang inovatif.",
    "Menumbuhkan budaya literasi, numerasi, serta kemampuan berpikir kritis, kreatif, komunikasi, dan kolaborasi sebagai bekal menghadapi tantangan abad ke-21.",
    "Menumbuhkan semangat nasionalisme, cinta tanah air, toleransi, serta penghargaan terhadap keberagaman budaya sebagai pengamalan nilai-nilai Pancasila.",
    "Mengembangkan potensi, bakat, minat, dan prestasi murid melalui kegiatan intrakurikuler, kokurikuler, dan ekstrakurikuler secara optimal.",
    "Membangun budaya kolaboratif antara sekolah, orang tua, dan masyarakat dalam menciptakan lingkungan belajar yang aman, nyaman, inklusif, dan berkualitas.",
  ];

  // ==========================================
  // GSAP: ANIMASI MISI & HERO
  // ==========================================
  useEffect(() => {
    gsap.fromTo(
      ".mission-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".mission-grid",
          start: "top 80%",
        },
      },
    );
  }, []);

  useGSAP(
    () => {
      // 1. Animasi reveal awal (Hero & Sejarah)
      const tl = gsap.timeline();
      tl.from(".gsap-fade-in", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });
      tl.from(
        ".gsap-scale-in",
        { opacity: 0, scale: 0.95, duration: 0.6, ease: "back.out(1.2)" },
        "-=0.4",
      );

      // 2. Efek Parallax di Bagian Video
      gsap.fromTo(
        ".gsap-parallax-bg",
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(".gsap-video-box", {
        scale: 0.9,
        opacity: 0.8,
        duration: 1,
        scrollTrigger: {
          trigger: videoSectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen relative overflow-x-hidden pt-24 pb-12"
    >
      {/* Ornamen Background Samar */}
      <div className="absolute top-[15%] right-[-10%] w-150 h-150 bg-blue-200/30 rounded-full filter blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[60%] left-[-10%] w-125 h-125 bg-indigo-100/40 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 space-y-32 relative z-10">
        {/* ==========================================
            SECTION 1: HERO & SEJARAH SEKOLAH
           ========================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="gsap-fade-in text-xs font-black text-blue-600 tracking-widest uppercase block">
              PROFIL LEMBAGA
            </span>
            <h1 className="gsap-fade-in text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Mengakar Pada Sejarah,{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                Mekar Pada Inovasi
              </span>
            </h1>
            <div className="gsap-fade-in w-20 h-1.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 p-8 rounded-4xl shadow-sm space-y-4 gsap-scale-in">
            <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
              <span>📜</span> Sejarah Singkat Sekolah
            </h3>
            <div className="space-y-6 text-justify">
              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                Didirikan resmi pada 1 Januari 1972,{" "}
                <strong className="font-semibold text-slate-900">
                  SDN 47 Kota Jambi
                </strong>{" "}
                awalnya bermula dari sebuah bangunan sederhana dengan misi
                mulia: menyediakan pendidikan dasar yang layak bagi masyarakat
                di kawasan Telanaipura. Seiring bergulirnya waktu, sekolah ini
                terus berbenah secara masif.
              </p>
              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                Memasuki tahun 2026, di bawah naungan ekosistem digital baru,
                SDN 47 secara konsisten mempertahankan{" "}
                <strong className="font-semibold text-slate-900">
                  Akreditasi A
                </strong>{" "}
                dan berhasil bertransformasi menjadi salah satu sekolah dasar
                percontohan.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 2: KATA SAMBUTAN KEPALA SEKOLAH
           ========================================== */}
        <section className="bg-white border border-slate-200/80 rounded-4xl p-8 sm:p-12 lg:p-16 shadow-xl grid grid-cols-1 md:grid-cols-12 max-md:gap-42 items-start relative overflow-hidden">
          <div className="md:col-span-4 flex flex-col items-center text-center sticky top-28">
            <div className="w-48 h-56 rounded-3xl bg-slate-100 overflow-hidden shadow-md p-2 bg-linear-to-tr from-blue-100 to-indigo-200 border border-slate-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src={kepsek}
                alt="Kepala Sekolah SDN 47"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h4 className="font-black text-slate-950 mt-4 text-lg leading-tight">
              HARUNSYAH, M.Pd.
            </h4>
            <p className="text-xs text-blue-600 font-bold tracking-wide uppercase mt-1">
              Kepala Sekolah SDN 47 Kota jambi
            </p>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              NIP. 19730825 200604 1 010
            </div>
          </div>

          <div className="md:col-span-8 space-y-6 text-slate-700 font-light text-sm sm:text-base leading-relaxed">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
              SAMBUTAN RESMI
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
              Selamat Datang di Portal Edukasi SDN 47
            </h3>
            <p className="font-medium text-slate-900">
              Assalamu'alaikum Warahmatullahi Wabarakatuh,
            </p>
            <div className="text-justify space-y-4">
              <p>
                Puji syukur ke hadirat Tuhan Yang Maha Esa atas segala
                rahmat-Nya. Selamat datang di rumah digital SDN 47 Kota Jambi.
              </p>
              <p>
                Pendidikan dasar adalah masa emas pembentukan karakter. Di SDN
                47, tujuan kami bukan hanya sekadar mengejar angka di atas
                kertas, melainkan menumbuhkan budi pekerti dan rasa percaya diri
                anak.
              </p>
            </div>
            <p className="font-medium text-slate-950 pt-2">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh.
            </p>
          </div>
        </section>

        {/* ==========================================
            SECTION 3: VISI & MISI SEKOLAH
           ========================================== */}
        <section className="py-10 bg-slate-50" ref={missionRef}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Card Visi */}
              <div className="lg:col-span-5 bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl p-10 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[180px] font-black opacity-5 pointer-events-none">
                  VISI
                </div>
                <span className="text-xs font-bold tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10 w-max uppercase">
                  HALUAN UTAMA
                </span>
                <div className="space-y-4 mt-12">
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    Visi Kami
                  </h2>
                  <p className="text-blue-50 font-medium text-xl leading-relaxed italic">
                    Terwujudnya generasi edukatif, mandiri, inovatif, literatif,
                    agamis, nasionalis, dan gemar berprestasi.
                  </p>
                </div>
              </div>

              {/* Card Misi */}
              <div className="lg:col-span-7 bg-white border border-slate-100 p-10 rounded-4xl shadow-sm flex flex-col space-y-8">
                <div>
                  <span className="text-xs font-black text-blue-600 tracking-widest uppercase block mb-2">
                    STRATEGI CAPAIAN
                  </span>
                  <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
                    Misi Sekolah
                  </h2>
                </div>

                <div className="mission-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missions.map((text, i) => (
                    <div
                      key={i}
                      className="mission-card bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm mb-4">
                        0{i + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 4: PROGRAM UNGGULAN (PIE SLIDER LOGO TEGAK)
           ========================================== */}
        <section
          className="py-16 px-4 max-w-7xl mx-auto overflow-hidden"
          ref={sliderSectionRef}
        >
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-16">
            <span className="text-xs font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded-full">
              PILAR AKADEMIK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Program Unggulan
            </h2>
            <p className="text-slate-500 font-light text-sm">
              Klik logo di roda melingkar atau tunggu untuk melihat pilar
              unggulan sekolah.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Roda Interaktif (Circular Slider) */}
            <div className="relative flex-shrink-0 w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
              {/* Pusat Lingkaran Info */}
              <div className="absolute w-32 h-32 rounded-full bg-white shadow-xl z-20 flex flex-col items-center justify-center text-center p-2 border-4 border-indigo-100">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                  PILAR
                </span>
                <span className="text-xs font-black text-slate-950 uppercase">
                  {programs[activeIndex].title}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 bg-slate-100 px-2 py-0.5 rounded">
                  {programs[activeIndex].badge}
                </span>
              </div>

              {/* Garis Orbit Putus-putus */}
              <div
                className="absolute w-full h-full rounded-full border-2 border-dashed border-indigo-200 animate-spin-slow"
                style={{ animationDuration: "60s" }}
              ></div>

              {/* Roda Kontainer Berputar */}
              <div
                ref={wheelRef}
                className="relative w-full h-full rounded-full transition-transform duration-1000 ease-in-out"
              >
                {programs.map((item, index) => {
                  const angleRad = (index * angleStep - 90) * (Math.PI / 180);
                  const radius = 175;
                  const x = radius * Math.cos(angleRad);
                  const y = radius * Math.sin(angleRad);
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={index}
                      className="absolute cursor-pointer flex items-center justify-center transition-all duration-300"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        left: "50%",
                        top: "50%",
                      }}
                      onClick={() => setActiveIndex(index)}
                    >
                      {/* Counter-rotation supaya logo di dalam selalu tegak lurus */}
                      <div
                        className="transition-transform duration-1000 ease-in-out"
                        style={{
                          transform: `rotate(${activeIndex * angleStep}deg)`,
                        }}
                      >
                        <div
                          className={`w-12 h-12 sm:w-20 sm:h-20 rounded-4xl bg-white border-2 p-.5 shadow-lg flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "border-indigo-600 ring-4 ring-indigo-100 scale-200 -translate-y-3 shadow-2xl bg-indigo-50"
                              : "border-slate-200 hover:scale-105"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel Konten Deskripsi Samping */}
            <div className="content-panel text-center lg:text-left space-y-6 max-w-xl">
              <span className="text-xs font-black text-indigo-600 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded-full">
                {programs[activeIndex].badge}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tighter">
                {programs[activeIndex].title}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed">
                {programs[activeIndex].desc}
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 5: VIDEO PROFIL & PARALLAX
           ========================================== */}
        <section
          ref={videoSectionRef}
          className="relative h-137.5 rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center"
        >
          <div
            className="gsap-parallax-bg absolute inset-0 w-full h-[140%] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200')`,
            }}
          />
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 space-y-6 text-white">
            <span className="text-xs font-black tracking-widest text-blue-300 uppercase bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/20">
              AUDIO VISUAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              Video Profil & Sambutan
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm max-w-md mx-auto font-light">
              Klik tombol putar di bawah untuk menyaksikan paparan visi
              pendidikan langsung dari kepala sekolah kami.
            </p>

            <div className="gsap-video-box max-w-xl mx-auto aspect-video bg-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden mt-4 relative group">
              <video
                controls
                poster="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                className="w-full h-full object-cover"
              >
                <source src="/videos/sambutan-kepsek.mp4" type="video/mp4" />
                Browser kamu tidak mendukung pemutaran video html5.
              </video>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 6: LOKASI & GOOGLE MAPS
           ========================================== */}
        <section className="space-y-8">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
              AKSESIBILITAS
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Lokasi Sekolah
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-black text-slate-950 uppercase tracking-tight text-base">
                  Alamat Lengkap
                </h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Jl. RE. Marta Dinata No.38, Telanaipura, Kec. Telanaipura,
                  Kota Jambi, Jambi 36361
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <span>📞</span> <span>(0741) 65544</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌐</span> <span>sdn47jambi.sch.id</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 h-87.5 lg:h-auto rounded-3xl overflow-hidden border border-slate-200 shadow-md relative bg-slate-100">
              <iframe
                title="Google Maps Lokasi SDN 47"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.241973912622!2d103.58381449999999!3d-1.6106500999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e25886750eb8be9%3A0xceacd276a7c50032!2sElementary%20School%2047%20%2F%20IV%20Jambi!5e0!3m2!1sen!2sid!4v1784219737204!5m2!1sen!2sid"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Global CSS Style untuk Animasi Putar Lambat */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
      `}</style>
    </div>
  );
}
