import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import ReactQuill from "react-quill-new";
// CSS diimpor via CDN di index.html, jadi baris import css lokal dihapus

export default function AdminNews() {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const [loading, setLoading] = useState(false);

  const [preview1, setPreview1] = useState(null);
  const [file1, setFile1] = useState(null);

  const [preview2, setPreview2] = useState(null);
  const [file2, setFile2] = useState(null);

  const [preview3, setPreview3] = useState(null);
  const [file3, setFile3] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "PRESTASI",
    dateString: "",
    videoUrl: "",
  });

  const handleCompressAndSet = async (e, setFileFunc, setPreviewFunc) => {
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
      setFileFunc(compressed);
      setPreviewFunc(URL.createObjectURL(compressed));
      toast.dismiss(toastId);
      toast.success("Gambar siap!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Gagal kompres foto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file1 || !formData.title || !formData.content) {
      return toast.error("Judul, Konten, dan Foto Utama wajib diisi!");
    }

    setLoading(true);
    const loadingToast = toast.loading("Menerbitkan berita...");

    try {
      const uploadToCloudinary = async (fileToUpload) => {
        const dataCloudinary = new FormData();
        dataCloudinary.append("file", fileToUpload);
        dataCloudinary.append("upload_preset", "admin_sekolah");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload`,
          { method: "POST", body: dataCloudinary },
        );
        const fileData = await res.json();
        if (!res.ok)
          throw new Error(fileData.error?.message || "Gagal upload gambar");
        return fileData.secure_url;
      };

      const imageUrl1 = await uploadToCloudinary(file1);
      const imageUrl2 = file2 ? await uploadToCloudinary(file2) : "";
      const imageUrl3 = file3 ? await uploadToCloudinary(file3) : "";

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
        imageUrl: imageUrl1,
        imageUrl2: imageUrl2,
        imageUrl3: imageUrl3,
        videoUrl: formData.videoUrl || "",
        views: 0,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Berita berhasil diterbitkan! 🚀");

      setFormData({
        title: "",
        content: "",
        category: "PRESTASI",
        dateString: "",
        videoUrl: "",
      });
      setPreview1(null);
      setFile1(null);
      setPreview2(null);
      setFile2(null);
      setPreview3(null);
      setFile3(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-950">Buat Berita Baru</h2>
        <Link
          to="/admin"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          required
          type="text"
          placeholder="Judul Berita..."
          className="w-full p-4 rounded-xl border border-slate-200 outline-none font-medium"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium"
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
            placeholder="Label Tanggal (Misal: 25 Juli 2026)"
            className="w-full p-4 rounded-xl border border-slate-200"
            value={formData.dateString}
            onChange={(e) =>
              setFormData({ ...formData, dateString: e.target.value })
            }
          />
        </div>

        <input
          type="url"
          placeholder="Link Video / YouTube / Cloudinary (Opsional)"
          className="w-full p-4 rounded-xl border border-slate-200 outline-none"
          value={formData.videoUrl}
          onChange={(e) =>
            setFormData({ ...formData, videoUrl: e.target.value })
          }
        />

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">
            Isi Konten Berita
          </label>
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              className="h-64 mb-12"
            />
          </div>
        </div>

        {/* Upload 3 Foto */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Lampiran Foto Berita
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Foto 1 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">
                Foto Utama (Wajib)
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-blue-400 h-40 flex flex-col items-center justify-center overflow-hidden"
                onClick={() => fileInputRef1.current.click()}
              >
                {preview1 ? (
                  <img
                    src={preview1}
                    alt="Preview 1"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    + Upload Foto 1
                  </span>
                )}
                <input
                  type="file"
                  ref={fileInputRef1}
                  className="hidden"
                  onChange={(e) =>
                    handleCompressAndSet(e, setFile1, setPreview1)
                  }
                  accept="image/*"
                />
              </div>
            </div>

            {/* Foto 2 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">
                Foto Kedua (Opsional)
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-blue-400 h-40 flex flex-col items-center justify-center overflow-hidden"
                onClick={() => fileInputRef2.current.click()}
              >
                {preview2 ? (
                  <img
                    src={preview2}
                    alt="Preview 2"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    + Upload Foto 2
                  </span>
                )}
                <input
                  type="file"
                  ref={fileInputRef2}
                  className="hidden"
                  onChange={(e) =>
                    handleCompressAndSet(e, setFile2, setPreview2)
                  }
                  accept="image/*"
                />
              </div>
            </div>

            {/* Foto 3 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">
                Foto Ketiga (Opsional)
              </label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-blue-400 h-40 flex flex-col items-center justify-center overflow-hidden"
                onClick={() => fileInputRef3.current.click()}
              >
                {preview3 ? (
                  <img
                    src={preview3}
                    alt="Preview 3"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    + Upload Foto 3
                  </span>
                )}
                <input
                  type="file"
                  ref={fileInputRef3}
                  className="hidden"
                  onChange={(e) =>
                    handleCompressAndSet(e, setFile3, setPreview3)
                  }
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>

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
