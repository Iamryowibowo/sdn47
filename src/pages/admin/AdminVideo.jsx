import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function AdminVideo() {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    downloadUrl: "",
    thumbnailUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

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
    setLoading(true);

    try {
      let finalThumbnailUrl = formData.thumbnailUrl;

      if (imageFile) {
        toast.loading("Mengunggah gambar ke Cloudinary...", { id: "upload" });
        finalThumbnailUrl = await uploadToCloudinary(imageFile);
        toast.success("Gambar diunggah!", { id: "upload" });
      }

      await addDoc(collection(db, "videos"), {
        title: formData.title,
        videoUrl: formData.videoUrl,
        downloadUrl: formData.downloadUrl,
        thumbnailUrl: finalThumbnailUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Video berhasil diterbitkan!", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });

      setFormData({
        title: "",
        videoUrl: "",
        downloadUrl: "",
        thumbnailUrl: "",
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
          placeholder="Link YouTube (Opasional - https://youtube.com/...)"
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 block">
            Upload Thumbnail (PNG/JPEG, Otomatis &lt; 500KB)
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className="w-full p-3 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
          className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 ${loading || compressing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Sedang Mengunggah..." : "Terbitkan Video"}
        </button>
      </form>
    </div>
  );
}
