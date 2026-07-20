import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

export default function AdminVideo() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    downloadUrl: "",
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Mengompres thumbnail...");
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
      toast.success("Thumbnail siap!");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Gagal kompres foto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!compressedFile || !formData.title) {
      return toast.error("Judul dan Thumbnail wajib diisi!");
    }

    setLoading(true);
    const loadingToast = toast.loading("Menerbitkan video...");

    try {
      // 1. Upload ke Cloudinary pakai preset yang sama kayak gallery
      const dataCloudinary = new FormData();
      dataCloudinary.append("file", compressedFile);
      dataCloudinary.append("upload_preset", "admin_sekolah"); // Sesuaikan jika beda

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload`, // Sesuaikan cloud name lu
        {
          method: "POST",
          body: dataCloudinary,
        },
      );
      const fileData = await res.json();
      if (!res.ok)
        throw new Error(fileData.error?.message || "Gagal upload gambar");

      // 2. Simpan ke Firestore
      await addDoc(collection(db, "videos"), {
        title: formData.title,
        videoUrl: formData.videoUrl,
        downloadUrl: formData.downloadUrl,
        thumbnailUrl: fileData.secure_url,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Video berhasil diterbitkan! 🚀");

      // 3. Reset form
      setFormData({
        title: "",
        videoUrl: "",
        downloadUrl: "",
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-950">Buat Video Baru</h2>
        <Link
          to="/admin/news"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="text"
          placeholder="Judul Video..."
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          type="url"
          placeholder="Link YouTube (Opsional - https://youtube.com/...)"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />

        <input
          type="url"
          placeholder="Link Download Google Drive"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.downloadUrl}
          onChange={(e) =>
            setFormData({ ...formData, downloadUrl: e.target.value })
          }
        />

        {/* Upload Thumbnail Box mirip Gallery */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">
            Thumbnail Video (Otomatis Kompres &lt; 500KB)
          </label>
          <div
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl w-full h-48 object-cover"
              />
            ) : (
              <p className="py-8 text-slate-400 font-medium">
                Klik untuk pilih gambar thumbnail...
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

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sedang Mengunggah..." : "Terbitkan Video"}
        </button>
      </form>
    </div>
  );
}
