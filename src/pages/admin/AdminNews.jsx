/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression"; // Library kompresi

export default function AdminNews() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null); // File yang sudah dipangkas
  const [formData, setFormData] = useState({
    title: "",
    category: "PENGUMUMAN",
    content: "",
    videoUrl: "",
  });

  // Fungsi "Jaring" (Kompresor)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Mengompres foto...");
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      setPreview(URL.createObjectURL(compressed));
      toast.dismiss(toastId);
      toast.success("Foto siap!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Gagal kompres foto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!compressedFile) return toast.error("Pilih foto dulu!");

    setLoading(true);
    const loadingToast = toast.loading("Menerbitkan...");

    try {
      // 1. Upload ke Cloudinary
      const dataCloudinary = new FormData();
      dataCloudinary.append("file", compressedFile); // Pakai file yang sudah dikompres
      dataCloudinary.append("upload_preset", "admin_sekolah");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload`,
        {
          method: "POST",
          body: dataCloudinary,
        },
      );
      const fileData = await res.json();

      // 2. Simpan ke Firestore
      await addDoc(collection(db, "news"), {
        ...formData,
        imageUrl: fileData.secure_url,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-black">Buat Berita Baru</h2>
          <Link to="/admin/dashboard" className="text-blue-600 font-bold">
            ← Kembali
          </Link>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Kolom Kiri */}
          <div className="md:col-span-2 space-y-5">
            <input
              type="text"
              placeholder="Judul Berita..."
              required
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <textarea
              rows="6"
              placeholder="Isi berita..."
              required
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          {/* Kolom Kanan (Upload & Kategori) */}
          <div className="space-y-5">
            {/* Pilihan Kategori Berita yang Diperluas */}
            <select
              className="w-full p-4 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-blue-600"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="PENGUMUMAN">📢 Pengumuman</option>
              <option value="KEGIATAN">🏆 Kegiatan Sekolah</option>
              <option value="PRESTASI">⭐ Prestasi Siswa</option>
              <option value="AKADEMIK">📚 Akademik & Kurikulum</option>
              <option value="EKSTRAKURIKULER">⚽ Ekstrakurikuler</option>
              <option value="ARTIKEL">✍️ Artikel & Opini</option>
              <option value="BERITA">📰 Berita Umum</option>
            </select>

            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-xl w-full h-40 object-cover"
                />
              ) : (
                <p className="py-8 text-slate-400 text-sm">
                  Klik pilih foto <br />
                  (otomatis dikompres)
                </p>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? "Menyimpan..." : "Terbitkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
