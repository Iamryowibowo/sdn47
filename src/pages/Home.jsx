import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase"; // Pastikan path ke file firebase.js Anda sudah benar
import home1 from "../assets/images/HOME1.jpeg";
import fotoKepsek from "../assets/images/KEPSEK.jpeg";
// Sesuaikan path-nya relatif terhadap file .jsx kamu
// Sesuaikan path-nya relatif terhadap file .jsx kamu
gsap.registerPlugin(useGSAP);

export default function Home() {
  const containerRef = useRef();
  const canvasRef = useRef();
  const [newsList, setNewsList] = useState([]);

  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc"),
      limit(2),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGalleryList(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLatestNews = async () => {
      // Mengambil 3 berita terbaru
      const q = query(
        collection(db, "news"),
        orderBy("createdAt", "desc"),
        limit(3),
      );
      const snapshot = await getDocs(q);
      setNewsList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchLatestNews();
  }, []);

  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case "PRESTASI":
        return "bg-emerald-50 text-emerald-600";
      case "PENGUMUMAN":
        return "bg-blue-50 text-blue-600";
      case "KEGIATAN":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  // =========================================================
  // 1. GENERATIVE LIGHT PARTICLES CANVAS (Efek Interaktif Mouse)
  // =========================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particlesArray = [];
    const numberOfParticles = 60;
    const mouse = { x: null, y: null, radius: 180 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 25 + 5;
      }
      draw() {
        // Partikel biru muda transparan yang elegan di light mode
        ctx.fillStyle = "rgba(37, 99, 235, 0.15)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
        }
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.hypot(dx, dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 - (distance / 150) * 0.08})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // =========================================================
  // 2. GSAP LUXURY LIGHT MODE ANIMATIONS
  // =========================================================
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".gsap-badge", {
        opacity: 0,
        scale: 0.9,
        y: -20,
        duration: 0.6,
        ease: "back.out(1.5)",
      });
      tl.from(
        ".gsap-title-line",
        { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: "power3.out" },
        "-=0.3",
      );
      tl.from(".gsap-desc", { opacity: 0, y: 15, duration: 0.5 }, "-=0.4");
      tl.from(".gsap-cta", { opacity: 0, y: 10, duration: 0.4 }, "-=0.2");

      // 3D Card Hover Effect (Tilt Manual via GSAP)
      const cards = document.querySelectorAll(".tilt-card-light");
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(card, {
            rotateY: x * 0.03,
            rotateX: -y * 0.03,
            transformPerspective: 800,
            duration: 0.3,
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="bg-slate-50 text-slate-900 min-h-screen relative overflow-hidden"
    >
      {/* CANVAS BACKGROUND (EFEK HIDUP TETEP ADA) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* AMBIENT SOFT LIGHT GLOW (Nuansa Bright Luxury) */}
      <div className="absolute top-[-10%] right-[-10%] w-150 h-150 bg-blue-200/40 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[30%] left-[-15%] w-175 h-175 bg-indigo-100/50 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* ==========================================
          SECTION 1: HERO CONTAINER (ASYMMETRIC ART)
         ========================================== */}
      <section className="relative z-10 min-h-[90vh] flex items-center px-4 sm:px-8 lg:px-20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="gsap-badge inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                Penerimaan Siswa Baru Terintegrasi
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] text-slate-950">
                <span className="gsap-title-line inline-block">Membentuk</span>{" "}
                <br />
                <span className="gsap-title-line inline-block bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                  Generasi Cerdas &
                </span>{" "}
                <br />
                <span className="gsap-title-line inline-block">
                  Berprestasi SDN 47.
                </span>
              </h1>

              {/* Moto Sekolah */}
              <div className="gsap-desc pt-4">
                <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
                  Moto Kami:
                </p>
                <p className="text-slate-700 font-medium text-base sm:text-lg max-w-xl leading-relaxed">
                  <span className="italic font-semibold text-slate-900">
                    "Generasi Edukatif, Mandiri, Inovatif, Literatif, Adaptif,
                    dan Gemar Berprestasi."
                  </span>
                </p>
              </div>
            </div>

            <div className="gsap-cta flex flex-wrap gap-4 pt-3">
              <Link
                to="/about"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5"
              >
                Jelajahi Profil Sekolah
              </Link>
              <a
                href="#sambutan"
                className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-2xl text-sm shadow-sm transition-all"
              >
                Dokumentasi Kegiatan
              </a>
            </div>
          </div>

          {/* Sisi Kanan: Image Frame Premium (Bukan Kotak Jadul) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-blue-300 rounded-[40px] filter blur-2xl opacity-20 rotate-6 scale-95"></div>
            <div className="relative border-2 border-white bg-white p-3 rounded-[36px] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-100 max-w-full">
              <img
                src={home1}
                alt="Siswa Belajar"
                className="rounded-[28px] object-cover max-md:h-95 h-100 w-full lg:w-150"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: REAL-TIME COUNTER (PREMIUM MINIMALIS)
         ========================================== */}
      <section className="relative z-10 py-12 bg-white/70 backdrop-blur-md border-y border-slate-200/60 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-slate-950">
              A <span className="text-blue-600 text-2xl font-bold">+</span>
            </div>
            <p className="text-slate-500 font-medium text-xs tracking-wider uppercase">
              Akreditasi BAN-S/M
            </p>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-slate-950">
              897<span className="text-indigo-500 text-2xl">+</span>
            </div>
            <p className="text-slate-500 font-medium text-xs tracking-wider uppercase">
              Siswa Aktif Terbina
            </p>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-slate-950">58</div>
            <p className="text-slate-500 font-medium text-xs tracking-wider uppercase">
              Tenaga Pendidik Ahli
            </p>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-slate-950">
              100<span className="text-emerald-500 text-2xl">%</span>
            </div>
            <p className="text-slate-500 font-medium text-xs tracking-wider uppercase">
              Fasilitas Ramah Anak
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: SAMBUTAN KEPALA SEKOLAH (ELEGANT PANEL)
         ========================================== */}
      <section
        id="sambutan"
        className="relative z-10 py-24 px-4 sm:px-8 lg:px-20 max-w-6xl mx-auto"
      >
        <div className="bg-white border border-slate-200/80 rounded-4xl p-8 sm:p-12 lg:p-16 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-xl"></div>

          <div className="md:col-span-4 flex flex-col items-center text-center">
            <div className="w-44 h-44 rounded-3xl bg-slate-100 overflow-hidden shadow-md p-2 bg-linear-to-tr from-blue-100 to-indigo-100 border border-slate-200">
              <img
                src={fotoKepsek}
                alt="Kepala Sekolah SDN 47"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <h4 className="font-black text-slate-950 mt-4 text-base leading-tight">
              HARUNSYAH, M.Pd.
            </h4>
            <p className="text-xs text-blue-600 font-bold tracking-wide uppercase mt-1">
              Kepala Sekolah SDN 47 KOTA JAMBI
            </p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase block">
              SAMBUTAN UTAMA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
              Mewujudkan Kolaborasi & Keterbukaan Informasi
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
              "Assalamu'alaikum Wr. Wb. Kami percaya bahwa setiap anak membawa
              keunikan bakatnya masing-masing. Melalui platform digital
              interaktif ini, kami berkomitmen menghadirkan ruang transparansi,
              mempererat komunikasi antara sekolah, guru, serta wali murid guna
              mendampingi tumbuh kembang buah hati kita secara maksimal."
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: BRIGHT BENTO GRID (ANTI-TEMPLATENESS)
         ========================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-16">
          <span className="text-xs font-black text-blue-600 tracking-widest uppercase">
            KEUNGGULAN UTAMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Kenapa Orang Tua Memilih Kami?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          {/* Card 1: Bento Besar */}
          <div className="tilt-card-light md:col-span-2 md:row-span-2 bg-white border border-slate-200 p-8 rounded-3xl shadow-md flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-blue-500/5 rounded-full filter blur-2xl"></div>
            <div className="text-3xl">🛡️</div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                Ekosistem Belajar Nyaman & Ramah Anak
              </h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed max-w-xl">
                Keamanan fisik dan psikologis siswa adalah prioritas utama kami.
                Seluruh area sekolah terpantau dengan tata tertib yang humanis
                demi membentuk budi pekerti luhur.
              </p>
            </div>
          </div>

          {/* Card 2: Bento Kanan Atas */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="text-3xl">📊</div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Kurikulum Merdeka</h3>
              <p className="text-blue-100 text-xs font-light leading-relaxed">
                Metode belajar berbasis projek (P5) yang mengasah kreativitas
                kontekstual anak sejak dini.
              </p>
            </div>
          </div>

          {/* Card 3: Bento Kiri Bawah */}
          <div className="tilt-card-light bg-white border border-slate-200 p-8 rounded-3xl shadow-md flex flex-col justify-between group">
            <div className="text-3xl">💻</div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                Fasilitas Kelas Baru
              </h3>
              <p className="text-slate-600 text-xs font-light">
                Ruang multimedia modern, mushola, akses penunjang digital, dan
                perpustakaan lengkap.
              </p>
            </div>
          </div>

          {/* Card 4: Bento Kanan Bawah */}
          <div className="tilt-card-light bg-white border border-slate-200 p-8 rounded-3xl shadow-md flex flex-col justify-between group">
            <div className="text-3xl">🏆</div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                Ekstrakurikuler Unggul
              </h3>
              <p className="text-slate-600 text-xs font-light">
                Pengembangan bakat mulai dari seni tari daerah, olahraga
                prestasi, hingga Pramuka inti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: LIVE STUDENT GALLERIES (HAWA SISWA KELIHTAN)
         ========================================== */}
      <section className="relative z-10 py-20 bg-white border-y border-slate-200/60 px-4 sm:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-indigo-600 tracking-widest uppercase">
                AKTIVITAS NYATA
              </span>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">
                Keseruan Siswa SDN 47
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
            >
              Lihat Galeri Foto{" "}
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Grid Foto Asimetris Dinamis */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {galleryList.map((item, index) => (
              <div
                key={item.id}
                className={`tilt-card-light ${
                  index === 0 ? "md:col-span-7" : "md:col-span-5"
                } bg-slate-100 rounded-3xl overflow-hidden shadow-md h-75 relative group`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                  {/* Kategori dengan warna dinamis */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full w-max mb-2 uppercase ${getCategoryColor(
                      item.category,
                    )}`}
                  >
                    {item.category}
                  </span>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: NEWS & ARTICLES (DYNAMICAL READY)
         ========================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="space-y-1">
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase">
              MEDIA INFORMASI
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Berita & Pengumuman Terbaru
            </h2>
          </div>
          <Link
            to="/news"
            className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 group whitespace-nowrap"
          >
            Baca Semua Artikel{" "}
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <Link
              to={`/news/${news.id}`}
              key={news.id}
              className="block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <article>
                <div className="h-44 bg-slate-200 overflow-hidden">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase inline-block ${getCategoryColor(news.category)}`}
                  >
                    {news.category || "Berita"}
                  </span>
                  <h3 className="font-bold text-base text-slate-950 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-400 text-xs">{news.dateString}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 7: TRUST & TESTIMONIAL PANEL (WALI MURID)
         ========================================== */}
      <section className="relative z-10 py-20 bg-slate-900 text-white rounded-t-[40px] px-4 sm:px-8 lg:px-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
            SUARA WALI MURID
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
            "Fasilitas digitalnya mempermudah kami memantau perkembangan anak,
            kurikulumnya pun membuat anak saya selalu antusias berangkat sekolah
            setiap pagi."
          </h2>
          <div className="text-xs font-semibold text-slate-400 tracking-wide">
            — Ibu Rosmana, Wali Murid Kelas IV A
          </div>
        </div>
      </section>
    </div>
  );
}
