import { useState, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

// Import GSAP dan Hook React-nya
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Daftarkan plugin GSAP agar aman di React
gsap.registerPlugin(useGSAP);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ref untuk kontainer utama (agar animasi scoped)
  const containerRef = useRef();

  // ----- BAGIAN ANIMASI GSAP -----
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // 1. Animasi background fade-in
      tl.from(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // 2. Animasi elemen di dalam card masuk satu per satu (Stagger)
      tl.from(".gsap-login-stagger", {
        y: 30, // move up
        opacity: 0, // fade in
        duration: 0.8,
        stagger: 0.15, // jeda antar elemen 0.15 detik
        ease: "back.out(1.7)", // sedikit efek memantul elit
        delay: -0.4, // mulai sedikit overlap dengan background
      });
    },
    { scope: containerRef },
  );
  // -------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Periksa email admin@admin.com dan password admin123
      await signInWithEmailAndPassword(auth, email, password);
      // Sukses login, arahkan ke dashboard
      navigate("/admin/dashboard");
    } catch {
      // FIX LINT ERROR: Kita hapus (err) karena tidak dipakai detailnya
      setError(
        "Email atau password admin tidak valid! Tolong periksa kembali.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Kontainer Utama (bg-slate-50 memberikan nuansa putih bersih)
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
    >
      {/* CARD LOGIN ELIT (bg-white, shadow-2xl, rounded-2xl) */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 lg:p-12 space-y-8">
        {/* GSAP: Elemen 1 - Header Logo & Teks */}
        <div className="text-center space-y-3 gsap-login-stagger">
          {/* Logo Toga Sekolah Biru */}
          <div className="mx-auto w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-blue-100">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
            SDN 47 Portal
          </h2>
          <p className="text-base text-slate-500 max-w-xs mx-auto">
            Selamat datang kembali! Silakan masuk ke dashboard utama.
          </p>
        </div>

        {/* GSAP: Elemen 2 - Pesan Error (Sleek) */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 gsap-login-stagger shadow-inner">
            <svg
              className="w-6 h-6 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* GSAP: Elemen 3 - Input Email */}
          <div className="gsap-login-stagger">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2.5">
              Email Akses
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 shadow-sm"
            />
          </div>

          {/* GSAP: Elemen 4 - Input Password */}
          <div className="gsap-login-stagger">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 shadow-sm"
            />
          </div>

          {/* GSAP: Elemen 5 - Tombol Login Elit (bg-primary / biru) */}
          <button
            type="submit"
            disabled={loading}
            className="gsap-login-stagger w-full py-4 px-6 bg-primary hover:bg-blue-800 text-white font-semibold rounded-xl text-base transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Verifikasi..." : "Masuk Portal"}
            {!loading && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
