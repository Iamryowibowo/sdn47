import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // Sesuaikan path ini

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setVideos(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-slate-950 mb-8 uppercase tracking-tighter">
        Semua Video Pembelajaran
      </h1>

      {loading ? (
        <p>Memuat semua video...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const videoId = vid.videoUrl.includes("youtu.be")
              ? vid.videoUrl.split("/").pop()
              : vid.videoUrl.split("v=")[1];

            return (
              <div
                key={vid.id}
                className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  className="w-full aspect-video rounded-2xl object-cover mb-4"
                  alt={vid.title}
                />
                <h3 className="font-bold text-slate-900 mb-3 line-clamp-2">
                  {vid.title}
                </h3>
                <div className="flex gap-3">
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full"
                  >
                    WATCH
                  </a>
                  {vid.downloadUrl && (
                    <a
                      href={vid.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-full"
                    >
                      DOWNLOAD
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
