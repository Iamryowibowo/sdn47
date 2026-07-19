import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast"; // Pastikan sudah install library toast Anda

export default function AdminVideo() {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    downloadUrl: "",
    thumbnailUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Simpan ke Firestore
      await addDoc(collection(db, "videos"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // 2. Beri Notifikasi Sukses
      toast.success("Video berhasil diterbitkan!", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });

      // 3. Reset form setelah berhasil
      setFormData({
        title: "",
        videoUrl: "",
        downloadUrl: "",
        thumbnailUrl: "",
      });
    } catch (error) {
      console.error("Gagal:", error);
      toast.error("Gagal menerbitkan video. Coba lagi.");
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
          required
          type="url"
          placeholder="Link YouTube (https://youtube.com/...)"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />

        <input
          type="url"
          placeholder="Link Download Google Drive)"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.downloadUrl}
          onChange={(e) =>
            setFormData({ ...formData, downloadUrl: e.target.value })
          }
        />

        <input
          required
          type="url"
          placeholder="Link URL Thumbnail Image"
          className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.thumbnailUrl}
          onChange={(e) =>
            setFormData({ ...formData, thumbnailUrl: e.target.value })
          }
        />

        <button
          disabled={loading}
          type="submit"
          className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Sedang Mengunggah..." : "Terbitkan Video"}
        </button>
      </form>
    </div>
  );
}
