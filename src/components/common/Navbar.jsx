import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, User, X } from "lucide-react";
import sekolahLogo from "../../assets/logo.png";

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
      className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Identitas (Ditambahkan min-w-0 biar fleksibel & tidak meluber) */}
        {/* Logo & Identitas */}
        <Link to="/" className="flex items-center gap-3 group min-w-0 pr-2">
          {/* Bagian bg-blue-600 dan shadow-sm dihapus, diganti transparan */}
          <div className="flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0">
            <img
              className="size-9 sm:size-10 object-contain"
              src={sekolahLogo}
              alt="Logo Sekolah"
            />
          </div>
          <div className="min-w-0">
            <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 block leading-tight truncate">
              SDN 47 KOTA JAMBI
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-sky-600 capitalize block truncate">
              Sekolah ramah anak, berprestasi, dan berbudaya
            </span>
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8 shrink-0">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Tombol Portal Admin Desktop */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100"
          >
            <User size={16} />
            Portal Admin
          </Link>
        </div>

        {/* Tombol Mobile Menu Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      <div
        className={`absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-lg md:hidden transition-all duration-300 ease-in-out transform origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 px-4 py-3 rounded-xl transition-all block"
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 w-full shadow-xs"
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
