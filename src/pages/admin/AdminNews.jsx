import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

export default function AdminNews() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "PRESTASI",
    dateString: "",
    videoUrl: "", // <-- Tambahan untuk link YouTube berita video
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Mengompres gambar...");
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      setPreview(URL.createObjectURL(compressed));
      toast.dismiss(toastId);
      toast.success("Gambar siap!");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Gagal kompres foto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!compressedFile || !formData.title || !formData.content) {
      return toast.error("Judul, Konten, dan Foto Banner wajib diisi!");
    }

    setLoading(true);
    const loadingToast = toast.loading("Menerbitkan berita...");

    try {
      // 1. Upload foto banner ke Cloudinary
      const dataCloudinary = new FormData();
      dataCloudinary.append("file", compressedFile);
      dataCloudinary.append("upload_preset", "admin_sekolah"); // Sesuaikan preset cloudinary kamu

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload`, // Sesuaikan cloud name kamu
        {
          method: "POST",
          body: dataCloudinary,
        },
      );
      const fileData = await res.json();
      if (!res.ok)
        throw new Error(fileData.error?.message || "Gagal upload gambar");

      // 2. Simpan data lengkap ke koleksi 'news' di Firestore
      await addDoc(collection(db, "news"), {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        dateString:
          formData.dateString ||
          new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        imageUrl: fileData.secure_url, // URL gambar dari Cloudinary
        videoUrl: formData.videoUrl || "", // URL YouTube opsional (jika diisi, berita utama jadi video)
        views: 0,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Berita berhasil diterbitkan! 🚀");

      // 3. Reset form
      setFormData({
        title: "",
        content: "",
        category: "PRESTASI",
        dateString: "",
        videoUrl: "",
      });
      setPreview(null);
      setCompressedFile(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Gagal:", error);
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-950">Buat Berita Baru</h2>
        <Link
          to="/admin"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Judul Berita */}
        <input
          required
          type="text"
          placeholder="Judul Berita..."
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Kategori & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700 font-medium"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="PRESTASI">Prestasi</option>
            <option value="PENGUMUMAN">Pengumuman</option>
            <option value="KEGIATAN">Kegiatan</option>
            <option value="AKADEMIK">Akademik</option>
            <option value="EKSTRAKURIKULER">Ekstrakurikuler</option>
            <option value="ARTIKEL">Artikel</option>
          </select>

          <input
            type="text"
            placeholder="Label Tanggal (Misal: 22 Juli 2026)"
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
            value={formData.dateString}
            onChange={(e) =>
              setFormData({ ...formData, dateString: e.target.value })
            }
          />
        </div>

        {/* Link YouTube (Opsional - Jika ingin beritanya berwujud Video) */}
        <input
          type="url"
          placeholder="Link YouTube Berita (Opsional - https://youtube.com/...)"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />
        <p className="text-[11px] text-slate-400 -mt-2 px-1">
          *Kosongkan jika berita berupa foto biasa. Jika diisi, kotak berita
          utama akan memutar video YouTube ini.
        </p>

        {/* Konten Berita */}
        <textarea
          required
          rows="6"
          placeholder="Tulis isi berita di sini..."
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />

        {/* Upload Foto Banner / Thumbnail */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">
            Foto Banner Berita (Wajib - Otomatis Kompres &lt; 500KB)
          </label>
          <div
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl w-full h-56 object-cover"
              />
            ) : (
              <p className="py-8 text-slate-400 font-medium">
                Klik untuk memilih foto banner berita...
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
        </div>

        {/* Tombol Submit */}
        <button
          disabled={loading}
          type="submit"
          className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sedang Menerbitkan..." : "Terbitkan Berita 🚀"}
        </button>
      </form>
    </div>
  );
}
