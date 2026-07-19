import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Kolom 1: Logo & Media Sosial */}
        <div className="space-y-5">
          <Link to="/" className="flex items-center gap-3 text-white group">
            <div className="bg-primary flex items-center justify-center text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <img
                className="size-9 object-contain"
                src="./src/assets/logo.png"
                alt="Logo Sekolah"
              />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none">
                SDN 47 KOTA JAMBI
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-primary uppercase block mt-1">
                Sekolah ramah anak, berprestasi, dan berbudaya
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Institusi pendidikan terakreditasi A yang mendedikasikan diri pada
            keunggulan akademik dan pembentukan karakter pemimpin masa depan.
          </p>

          {/* Ikon Sosial Media Murni SVG */}
          <div className="flex gap-4 pt-2">
            {/* Instagram - Arahkan ke link profil IG resmi */}
            {/* Instagram */}
            <a
              href="https://www.instagram.com/sdnegeri47kotajambi/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-pink-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
              </svg>
            </a>

            {/* Facebook - Arahkan ke link Facebook resmi */}
            <a
              href="https://www.facebook.com/sdn47kotajambi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-blue-800 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Youtube - Arahkan ke link Youtube resmi */}
            <a
              href="https://www.youtube.com/@sdnegeri47kotajambi95"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                <polygon
                  points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Kolom 2: Tautan */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
            Jelajahi
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Profil Sekolah
              </Link>
            </li>
            <li>
              <Link
                to="/programs"
                className="hover:text-white transition-colors"
              >
                Akademik & Program
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-white transition-colors">
                Berita & Artikel
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Kontak Resmi */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
            Kontak Resmi
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-primary shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="leading-relaxed">
                Jl. RE. Marta Dinata No.38, Telanaipura, Kec. Telanaipura, Kota
                Jambi{" "}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-primary shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>(0741) 65544</span>
            </li>
            <li className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-primary shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>jambisdn47@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Jam Operasional */}
        <div>
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-5">
            Jam Operasional
          </h4>
          <ul className="space-y-3 text-sm border-l-2 border-slate-800 pl-4">
            <li className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase font-semibold">
                Senin - Kamis
              </span>
              <span className="text-white font-medium mt-0.5">
                07:00 - 16:00 WIB
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase font-semibold">
                Jumat
              </span>
              <span className="text-white font-medium mt-0.5">
                07:00 - 11:30 WIB
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs text-red-400/70 uppercase font-semibold">
                Sabtu - Minggu
              </span>
              <span className="text-red-400 font-medium mt-0.5">
                Libur / Tutup
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>
          &copy; {currentYear} SDN 47 KOTA JAMBI. Seluruh Hak Cipta Dilindungi
          Undang-Undang.
        </p>
        <div className="flex gap-6 text-slate-500">
          <a href="#" className="hover:text-slate-400 transition-colors">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Syarat & Ketentuan
          </a>
        </div>
      </div>
    </footer>
  );
}
