import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Trash2, Video, Cloud, HardDrive } from "lucide-react";

/**
 * ============================================================================
 * ADMIN — KELOLA VIDEO SAHABAT SEKOLAH DASAR
 * ============================================================================
 * Form ini menulis & menghapus dokumen di koleksi Firestore "sahabat_videos",
 * dengan skema yang sama persis dengan yang dipakai halaman Sahabat.jsx:
 *
 * {
 *   title: string,
 *   description: string,
 *   source: "youtube" | "cloudinary" | "drive",
 *   url: string,
 *   category: string,
 *   date: string,        // "2026-08-17" (format YYYY-MM-DD)
 *   thumbnail: string,   // opsional, kosong "" kalau tidak diisi
 *   createdAt: Timestamp,
 * }
 *
 * Catatan: koleksi ini SENGAJA dibuat terpisah dari "videos" (yang dipakai
 * AdminVideo.jsx / News.jsx) karena skema field-nya beda. Kalau nanti
 * Sahabat.jsx disambungkan ke Firestore, arahkan query-nya ke "sahabat_videos".
 * ============================================================================
 */

const SOURCE_OPTIONS = [
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
    hint: "Tempel link video YouTube (watch?v= atau youtu.be/).",
  },
  {
    value: "cloudinary",
    label: "Cloudinary (file .mp4)",
    placeholder:
      "https://res.cloudinary.com/namacloud/video/upload/.../file.mp4",
    hint: "Tempel link file video langsung dari Cloudinary.",
  },
  {
    value: "drive",
    label: "Google Drive",
    placeholder: "https://drive.google.com/file/d/xxxxxxxxxxx/view",
    hint: "Tempel link share Google Drive (mode Anyone with the link).",
  },
];

const SOURCE_META = {
  youtube: {
    label: "YouTube",
    icon: Video,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  cloudinary: {
    label: "Cloudinary",
    icon: Cloud,
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  drive: {
    label: "Google Drive",
    icon: HardDrive,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
};

const CATEGORY_OPTIONS = [
  "Kegiatan",
  "Akademik",
  "Pembelajaran",
  "Ekstrakurikuler",
  "Prestasi",
];

function formatTanggal(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminSahabat() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    source: "youtube",
    url: "",
    category: "Kegiatan",
    date: new Date().toISOString().slice(0, 10),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // --- Daftar video untuk ditampilkan + dihapus ---
  const [videoList, setVideoList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const activeSource = SOURCE_OPTIONS.find((s) => s.value === formData.source);

  // ---------------------------------------------------------------------
  // Ambil daftar video secara realtime dari Firestore
  // ---------------------------------------------------------------------
  useEffect(() => {
    const q = query(
      collection(db, "sahabat_videos"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setVideoList(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })),
        );
        setLoadingList(false);
      },
      (error) => {
        console.error("Gagal memuat daftar video:", error);
        setLoadingList(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------------------
  // Kompresi gambar thumbnail sebelum upload (sama seperti AdminVideo.jsx)
  // ---------------------------------------------------------------------
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.9;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          while (dataUrl.length * 0.75 > 500 * 1024 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          const arr = dataUrl.split(",");
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          const compressedFile = new File(
            [u8arr],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            { type: "image/jpeg" },
          );
          resolve(compressedFile);
        };
        img.onerror = (error) => reject(error);
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Format gambar harus PNG atau JPEG!");
      return;
    }

    try {
      setCompressing(true);
      toast.loading("Mengompres gambar (< 500KB)...", { id: "compress" });

      const optimizedFile = await compressImage(file);

      setImageFile(optimizedFile);
      setImagePreview(URL.createObjectURL(optimizedFile));

      toast.success("Gambar berhasil dikompres!", { id: "compress" });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses gambar.", { id: "compress" });
    } finally {
      setCompressing(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "YOUR_UPLOAD_PRESET");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    const resData = await response.json();
    if (!response.ok) throw new Error("Gagal upload ke Cloudinary");
    return resData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      toast.error("Link video wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      let finalThumbnailUrl = "";

      if (imageFile) {
        toast.loading("Mengunggah thumbnail ke Cloudinary...", {
          id: "upload",
        });
        finalThumbnailUrl = await uploadToCloudinary(imageFile);
        toast.success("Thumbnail diunggah!", { id: "upload" });
      }

      await addDoc(collection(db, "sahabat_videos"), {
        title: formData.title,
        description: formData.description,
        source: formData.source,
        url: formData.url,
        category: formData.category,
        date: formData.date,
        thumbnail: finalThumbnailUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Video Sahabat SD berhasil diterbitkan!", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });

      setFormData({
        title: "",
        description: "",
        source: "youtube",
        url: "",
        category: "Kegiatan",
        date: new Date().toISOString().slice(0, 10),
      });
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Gagal:", error);
      toast.error("Gagal menerbitkan video. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------
  // Hapus video — minta konfirmasi dulu sebelum benar-benar delete
  // ---------------------------------------------------------------------
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "sahabat_videos", id));
      toast.success("Video berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      toast.error("Gagal menghapus video. Coba lagi.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* ============================ FORM TAMBAH VIDEO ============================ */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Kelola Video Sahabat SD
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dokumentasi program Sahabat Sekolah Dasar SDN 47 Kota Jambi
            </p>
          </div>
          <Link
            to="/admin/news"
            className="text-sm font-bold text-indigo-600 hover:underline shrink-0"
          >
            ← Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="text"
            placeholder="Judul Video..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            required
            rows={3}
            placeholder="Deskripsi singkat video..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* Sumber Video */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">
              Sumber Video
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, source: s.value, url: "" })
                  }
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    formData.source === s.value
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link Video (placeholder & hint mengikuti sumber terpilih) */}
          <div className="space-y-1.5">
            <input
              required
              type="url"
              placeholder={activeSource.placeholder}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <p className="text-[11px] text-slate-400 px-1">
              {activeSource.hint}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Kategori
              </label>
              <select
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">
                Tanggal
              </label>
              <input
                required
                type="date"
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Thumbnail (opsional) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">
              Upload Thumbnail{" "}
              <span className="font-normal text-slate-400">
                (Opsional — untuk YouTube otomatis diambil dari link jika
                kosong)
              </span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="w-full p-3 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {imagePreview && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            disabled={loading || compressing}
            type="submit"
            className={`w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-200 ${
              loading || compressing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sedang Menerbitkan..." : "Terbitkan Video Sahabat SD"}
          </button>
        </form>
      </div>

      {/* ============================ DAFTAR VIDEO (HAPUS) ============================ */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">
            Daftar Video Tersimpan
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {videoList.length} video
          </span>
        </div>

        {loadingList ? (
          <p className="text-sm text-slate-400 text-center py-10">
            Memuat daftar video...
          </p>
        ) : videoList.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">
            Belum ada video yang diterbitkan.
          </p>
        ) : (
          <div className="space-y-3">
            {videoList.map((vid) => {
              const meta = SOURCE_META[vid.source] || SOURCE_META.youtube;
              const Icon = meta.icon;
              const isConfirming = confirmDeleteId === vid.id;
              const isDeleting = deletingId === vid.id;

              return (
                <div
                  key={vid.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50"
                >
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                    {vid.thumbnail ? (
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.bg} ${meta.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {vid.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {vid.title || "(Tanpa judul)"}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatTanggal(vid.date)}
                    </p>
                  </div>

                  {/* Tombol hapus / konfirmasi */}
                  {isConfirming ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => confirmDelete(vid.id)}
                        disabled={isDeleting}
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                      </button>
                      <button
                        onClick={cancelDelete}
                        disabled={isDeleting}
                        className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(vid.id)}
                      className="shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors group"
                      aria-label="Hapus video"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
