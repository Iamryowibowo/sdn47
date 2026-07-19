import { useState, useRef, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

export default function AdminGallery() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "Projek P5",
  });

  // 1. Ambil data dengan toast (opsional tapi informatif)
  const fetchGalleries = async () => {
    const toastId = toast.loading("Memuat data..."); // Toast loading saat buka halaman
    try {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleries(data);
      toast.dismiss(toastId);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Gagal memuat galeri");
    }
  };

  useEffect(() => {
    // Buat fungsi async di dalam agar lebih aman
    const loadData = async () => {
      await fetchGalleries();
    };
    loadData();
  }, []); // Dependency array kosong sudah benar

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
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Gagal kompres foto");
    }
  };

  // 2. Pastikan handleUpload menggunakan toast sukses seperti AdminNews
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!compressedFile || !formData.title)
      return toast.error("Lengkapi data!");

    setLoading(true);
    const loadingToast = toast.loading("Menerbitkan ke galeri...");

    try {
      const dataCloudinary = new FormData();
      dataCloudinary.append("file", compressedFile);
      dataCloudinary.append("upload_preset", "admin_sekolah");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload`,
        {
          method: "POST",
          body: dataCloudinary,
        },
      );
      const fileData = await res.json();

      await addDoc(collection(db, "gallery"), {
        ...formData,
        imageUrl: fileData.secure_url,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(loadingToast);
      toast.success("Galeri berhasil diterbitkan! 🚀"); // Toast sukses
      setFormData({ title: "", category: "Projek P5" });
      setPreview(null);
      setCompressedFile(null);
      fetchGalleries();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // 1. Konfirmasi dulu
    if (!window.confirm("Yakin ingin menghapus foto ini?")) return;

    // 2. Tampilkan loading
    const loadingToast = toast.loading("Sedang menghapus...");

    try {
      // 3. Proses hapus
      await deleteDoc(doc(db, "gallery", id));

      // 4. Sukses
      toast.dismiss(loadingToast);
      toast.success("Foto berhasil dihapus!");
      fetchGalleries(); // Refresh daftar
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Form Input */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <header className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-black">Tambah Foto Galeri</h2>
            <Link to="/admin/dashboard" className="text-blue-600 font-bold">
              ← Kembali
            </Link>
          </header>

          <form onSubmit={handleUpload} className="space-y-6">
            <input
              type="text"
              placeholder="Judul Kegiatan..."
              required
              className="w-full p-4 rounded-xl border border-slate-200"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <select
              className="w-full p-4 rounded-xl border border-slate-200 font-bold"
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>Projek P5</option>
              <option>Prestasi</option>
              <option>Organisasi</option>
              <option>Peduli Lingkungan</option>
            </select>
            <div
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  className="rounded-xl w-full h-48 object-cover"
                />
              ) : (
                <p className="py-8 text-slate-400">
                  Klik pilih foto (otomatis dikompres)
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
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Terbitkan"}
            </button>
          </form>
        </div>

        {/* Daftar Galeri */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Daftar Foto Galeri</h3>
          <div className="space-y-4">
            {galleries.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 font-bold text-sm hover:underline"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
