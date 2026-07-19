import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Impor Halaman Publik
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Gallery from "./pages/Gallery";
import News from "./pages/News";

// Impor Pengatur Rute Admin (Menghilangkan Eror)
import AdminRoutes from "./pages/admin/AdminRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import TeacherStaff from "./pages/Teachers-Staff";
import NewsDetail from "./pages/NewsDetail";
import VideosPage from "./pages/Videos";

// Pembungkus khusus halaman utama sekolah (Pakai Navbar & Footer)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="grow pt-20">
        {/* Outlet adalah tempat di mana Home, About, News, dll akan bergantian muncul */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* KELOMPOK 1: Semua halaman sekolah yang butuh Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/teacher-staff" element={<TeacherStaff />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/videos" element={<VideosPage />} />
        </Route>

        {/* KELOMPOK 2: Portal Admin (Bebas dari Navbar & Footer Sekolah) */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}
