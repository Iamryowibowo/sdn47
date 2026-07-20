import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import kepsek from "../assets/images/KEPSEK.jpeg";

// Register ScrollTrigger untuk efek Parallax
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
  const containerRef = useRef();
  const videoSectionRef = useRef();
  const missionRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Animasi masuk yang super smooth saat di-scroll
    gsap.fromTo(
      ".program-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out", // Easing kelas atas, sangat smooth melambat di akhir
        stagger: 0.15, // Memberikan jeda antar kartu saat muncul
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // Mulai animasi ketika section 80% terlihat di layar
        },
      },
    );
  }, []);

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

  useEffect(() => {
    // Animasi Stagger untuk kartu misi
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

      // 2. Efek Parallax Keren di Bagian Video Speech
      // Elemen background video akan bergerak lebih lambat dibanding text overlay-nya
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

      // Zoom-in halus box video pas masuk viewport
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
      {/* ORNAMEN BACKGROUND SAMAR */}
      <div className="absolute top-[15%] right-[-10%] w-150 h-150 bg-blue-200/30 rounded-full filter blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[60%] left-[-10%] w-125 h-125 bg-indigo-100/40 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 space-y-32 relative z-10">
        {/* ==========================================
            SECTION 1: HERO & SEJARAH (ASYMMETRIC GRID)
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
                percontohan yang sukses mengintegrasikan kecerdasan emosional
                dengan fasilitas teknologi modern global.
              </p>

              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                Perjalanan panjang sejak 1972 ini tidak luput dari dedikasi para
                pendidik, dukungan penuh orang tua, serta sinergi komunitas
                lokal yang tiada henti. Dari ruang kelas konvensional hingga
                kini mengadopsi metode pembelajaran interaktif berbasis digital,
                sekolah terus berkomitmen mencetak generasi emas.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 2: KATA SAMBUTAN LENGKAP KEPALA SEKOLAH
           ========================================== */}
        <section className="bg-white border border-slate-200/80 rounded-4xl p-8 sm:p-12 lg:p-16 shadow-xl grid grid-cols-1 md:grid-cols-12 max-md:gap-42 items-start relative overflow-hidden">
          {/* Sisi Kiri: Foto Kepala Sekolah Elit */}
          <div className="md:col-span-4 flex flex-col items-center text-center sticky top-28">
            <div className="w-48 h-56 rounded-3xl bg-slate-100 overflow-hidden shadow-md p-2 bg-linear-to-tr from-blue-100 to-indigo-200 border border-slate-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src={kepsek}
                alt="Kepala Sekolah SDN 47"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            ;
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

          {/* Sisi Kanan: Teks Sambutan Komplit */}
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
                Portal ini kami hadirkan sebagai jembatan kasih sayang dan
                komunikasi, tempat kita dapat berbagi cerita serta melihat
                langsung keceriaan putra-putri kita dalam belajar setiap
                harinya.
              </p>
              <p>
                Pendidikan dasar adalah masa emas pembentukan karakter. Di SDN
                47, tujuan kami bukan hanya sekadar mengejar angka di atas
                kertas. Kami hadir untuk menumbuhkan **kebaikan budi, rasa
                percaya diri, serta semangat ingin tahu** yang besar. Kami
                percaya bahwa setiap anak adalah bintang kecil dengan
                keistimewaan masing-masing yang layak kita jaga dan kembangkan
                dengan penuh kesabaran.
              </p>
              <p>
                Berbekal Kurikulum Merdeka yang menyenangkan, kami berkomitmen
                menciptakan lingkungan sekolah yang aman, nyaman, dan ramah bagi
                anak. Kami mengajak Ayah, Bunda, dan seluruh keluarga besar SDN
                47 untuk terus bergandengan tangan, memberikan dukungan terbaik
                agar anak-anak kita tumbuh menjadi pribadi yang cerdas,
                berakhlak mulia, dan membanggakan.
              </p>
            </div>

            <p className="font-medium text-slate-950 pt-2">
              Wassalamu'alaikum Warahmatullahi Wabarakatuh.
            </p>
          </div>
        </section>

        {/* ==========================================
            SECTION 3: VISI & MISI (PREMIUM ASYMMETRIC)
           ========================================== */}
        <section className="py-20 bg-slate-50" ref={missionRef}>
          <div className="max-w-7xl mx-auto px-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
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

                {/* Grid Misi */}
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
            </section>
          </div>
        </section>

        {/* ==========================================
            SECTION 4: PROGRAM UNGGULAN SEKOLAH (NEW)
           ========================================== */}
        <section className="space-y-12" ref={sectionRef}>
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-black text-indigo-600 tracking-widest uppercase block">
              PILAR AKADEMIK
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Program Unggulan
            </h2>
            <p className="text-slate-500 font-light text-sm">
              Bersama Program Unggulan, Kita Wujudkan Generasi Gemilang.
            </p>
          </div>

          {/* Grid Layout - Struktur Asli Kamu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📖",
                title: "LENTERA",
                desc: "Literasi dan Numerasi Terencana untuk meraih prestasi. Pembelajaran bermakna, menyenangkan, dan berkelanjutan untuk prestasi akademik gemilang.",
              },
              {
                icon: "🛡️",
                title: "BERANI",
                desc: "Bebas Perundungan, Edukatif, Ramah, Aman, dan Inklusif. Menciptakan budaya saling menghargai dan lingkungan belajar yang nyaman bagi siswa.",
              },
              {
                icon: "✨",
                title: "BERKAH",
                desc: "Beriman, Berkarakter Mulia, Berakhlak, dan Harmonis. Menanamkan nilai keimanan dan membentuk karakter mulia bagi seluruh warga sekolah.",
              },
              {
                icon: "🤝",
                title: "SAHABAT",
                desc: "Sinergi Antara Home (Rumah). Kolaborasi aktif sekolah, orang tua, dan masyarakat untuk mendampingi tumbuh kembang anak.",
              },
              {
                icon: "💻",
                title: "TEPAT",
                desc: "Teknologi Pembelajaran Aktif dan Transformatif. Memanfaatkan teknologi untuk pembelajaran aktif, kreatif, dan siap menghadapi transformasi digital.",
              },
              {
                icon: "🌱",
                title: "BESTARI",
                desc: "Bawa Wadah, Entaskan Sampah, Tanamkan Aksi Resik dan Indah. Membudayakan aksi resik, mengurangi sampah plastik, dan menjaga kelestarian lingkungan.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="program-card bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 space-y-4 group cursor-pointer"
              >
                {/* Icon dengan efek scale pas hover */}
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  {item.icon}
                </div>

                {/* Judul Program */}
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Deskripsi - Sekarang selalu muncul dengan font-light yang bersih */}
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 5: VIDEO SAMBUTAN DENGAN PARALLAX EFFECT
           ========================================== */}
        <section
          ref={videoSectionRef}
          className="relative h-137.5 rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center"
        >
          {/* Background Parallax Layer */}
          <div
            className="gsap-parallax-bg absolute inset-0 w-full h-[140%] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200')`,
            }}
          />
          {/* Overlay Gelap */}
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"></div>

          {/* Konten Kontainer Floating (Terasa Kontras Saat di-Scroll) */}
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

            {/* Box Video Player Premium */}
            <div className="gsap-video-box max-w-xl mx-auto aspect-video bg-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden mt-4 relative group">
              {/* Note: Silakan ganti src dengan path file video asli kamu */}
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
            SECTION 6: LOKASI SEKOLAH (GOOGLE MAPS INTEGRATION)
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
            {/* Kiri: Info Kontak */}
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
    </div>
  );
}
