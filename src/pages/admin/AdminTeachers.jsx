import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const CATEGORIES = [
  { id: "pimpinan", label: "Struktural / Pimpinan" },
  { id: "guru", label: "Guru Pengajar" },
  { id: "staff", label: "Staff & Tata Usaha" },
];
const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

const ALLOWED_TYPES = ["image/jpeg", "image/png"]; // jpg & jpeg = image/jpeg
const MAX_RAW_SIZE = 10 * 1024 * 1024; // batas file asli sebelum dikecilkan

const EMPTY_FORM = { name: "", role: "", category: "guru", quote: "" };

const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", "admin_sekolah");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dkcoq6uge/image/upload",
    { method: "POST", body: fd },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Gagal upload gambar");
  return data.secure_url;
};

export default function AdminTeachers() {
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // dokumen yang sedang diedit
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  // Realtime dari Firestore
  useEffect(() => {
    const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        toast.error("Gagal memuat data personel");
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (s) =>
        (filter === "all" || s.category === filter) &&
        (!q ||
          s.name?.toLowerCase().includes(q) ||
          s.role?.toLowerCase().includes(q)),
    );
  }, [items, search, filter]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setFormOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || "",
      role: s.role || "",
      category: s.category || "guru",
      quote: s.quote || "",
    });
    setFile(null);
    setPreview(s.imageUrl || null);
    setFormOpen(true);
  };

  const handlePickImage = async (e) => {
    const picked = e.target.files[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih ulang
    if (!picked) return;

    // Validasi format: hanya JPG, JPEG, PNG
    const extOk = /\.(jpe?g|png)$/i.test(picked.name);
    if (!ALLOWED_TYPES.includes(picked.type) || !extOk) {
      return toast.error("Format harus JPG, JPEG, atau PNG!");
    }
    if (picked.size > MAX_RAW_SIZE) {
      return toast.error("Ukuran foto maksimal 10 MB!");
    }

    const toastId = toast.loading("Mengecilkan gambar...");
    try {
      const compressed = await imageCompression(picked, {
        maxSizeMB: 0.1, // target maks ~100 KB
        maxWidthOrHeight: 600, // otomatis di-resize, rasio tetap
        fileType: "image/webp", // format hemat ukuran
        useWebWorker: true,
      });
      setFile(compressed);
      setPreview(URL.createObjectURL(compressed));
      toast.success(
        `Foto siap! ${(picked.size / 1024).toFixed(0)} KB → ${(compressed.size / 1024).toFixed(0)} KB`,
        { id: toastId },
      );
    } catch {
      toast.error("Gagal memproses foto", { id: toastId });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      return toast.error("Nama dan jabatan wajib diisi!");
    }
    if (!editing && !file) {
      return toast.error("Foto wajib diupload!");
    }

    setSaving(true);
    const toastId = toast.loading("Menyimpan...");
    try {
      // Upload hanya kalau ada foto baru, kalau tidak pakai foto lama
      const imageUrl = file ? await uploadToCloudinary(file) : editing.imageUrl;
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        category: form.category,
        quote: form.quote.trim(),
        imageUrl,
      };

      if (editing) {
        await updateDoc(doc(db, "staff", editing.id), payload);
        toast.success("Perubahan disimpan", { id: toastId });
      } else {
        await addDoc(collection(db, "staff"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Personel ditambahkan", { id: toastId });
      }
      setFormOpen(false);
    } catch (err) {
      toast.error("Gagal: " + err.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Menghapus...");
    try {
      await deleteDoc(doc(db, "staff", deleting.id));
      toast.success("Personel dihapus", { id: toastId });
      setDeleting(null);
    } catch (err) {
      toast.error("Gagal hapus: " + err.message, { id: toastId });
    }
  };

  const field =
    "w-full p-3.5 rounded-xl border border-slate-200 bg-white outline-none text-sm font-medium focus:border-blue-500";

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-950">
            Kelola Guru & Staff
          </h2>
          <p className="text-sm text-slate-500">
            {items.length} personel terdaftar
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            ← Kembali
          </Link>
          <button
            onClick={openAdd}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-200 transition-all"
          >
            + Tambah Personel
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau jabatan..."
          className={field}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={field}
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
            <tr>
              <th className="px-5 py-3">Personel</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="hidden md:table-cell px-5 py-3">Kutipan</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  Memuat data...
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  {items.length === 0
                    ? "Belum ada personel. Klik “Tambah Personel” untuk mulai."
                    : "Tidak ada hasil untuk pencarian ini."}
                </td>
              </tr>
            )}
            {visible.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="h-11 w-11 rounded-full bg-slate-100 object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {categoryLabel(s.category)}
                </td>
                <td className="hidden md:table-cell max-w-xs truncate px-5 py-3 italic text-slate-500">
                  {s.quote}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(s)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal form tambah/edit */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={handleSave}
            className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-black text-slate-950">
              {editing ? "Edit Personel" : "Tambah Personel"}
            </h3>

            <input
              required
              className={field}
              placeholder="Nama lengkap & gelar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              className={field}
              placeholder="Jabatan (Misal: Wali Kelas VI A)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <select
              className={field}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              className={field}
              placeholder="Kutipan (Opsional)"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
            />

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Foto {editing ? "(klik untuk ganti)" : "(Wajib)"}
              </label>
              <div
                className="flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 p-3 text-center hover:border-blue-400"
                onClick={() => fileInputRef.current.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">+ Upload Foto</span>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={handlePickImage}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Format JPG, JPEG, atau PNG (maks 10 MB). Otomatis dikecilkan
                sebelum diupload.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white hover:bg-blue-700 ${
                  saving ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Konfirmasi hapus */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-black text-slate-950">
              Hapus personel?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              <b>{deleting.name}</b> akan dihapus dari halaman Guru & Staff.
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-black text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
