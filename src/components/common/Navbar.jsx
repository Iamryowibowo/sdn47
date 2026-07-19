import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, User, X } from "lucide-react";
import sekolahLogo from "../../assets/logo.png"; // Sesuaikan path ini

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const headerRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/about" },
    { name: "Akademik", href: "/programs" },
    { name: "Guru & Staff", href: "/teacher-staff" },
    { name: "Berita", href: "/news" },
  ];

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Sekolah Original */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary flex items-center justify-center text-white p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <img
              className="size-9 object-contain"
              src={sekolahLogo}
              alt="Logo Sekolah"
            />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-900 block leading-none">
              SDN 47 KOTA JAMBI
            </span>
            <span className="text-xs font-semibold tracking-widest text-primary capitalize">
              Sekolah ramah anak, berprestasi, dan berbudaya
            </span>
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Tombol Portal Admin Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
          >
            <User size={16} />
            Portal Admin
          </Link>
        </div>

        {/* Tombol Mobile Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ==========================================
          MOBILE DROPDOWN DRAWER (YANG SUDAH DI-UPDATE)
         ========================================== */}
      <div
        className={`absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 md:hidden transition-all duration-300 ease-in-out transform origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {/* Mengubah gap menjadi lebih rapat (gap-1.5) karena menu sekarang berbentuk box padding */}
        <div className="px-6 py-5 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 px-4 py-3 rounded-xl transition-all block"
            >
              {item.name}
            </Link>
          ))}

          {/* Menu Portal Admin Versi Mobile */}
          <div className="pt-3 mt-1 border-t border-slate-100">
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-primary bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 w-full"
            >
              <User size={16} />
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
