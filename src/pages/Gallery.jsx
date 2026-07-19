import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' terbaru, 'asc' terlama
  const [filter, setFilter] = useState("Semua");
  const galleryRef = useRef(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      const q = query(
        collection(db, "gallery"),
        orderBy("createdAt", sortOrder),
      );
      const snapshot = await getDocs(q);
      setGalleries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchGalleries();
  }, [sortOrder]);

  // Efek Parallax & ScrollTrigger
  useEffect(() => {
    const items = gsap.utils.toArray(".gallery-item");
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, [galleries]);

  const filteredData =
    filter === "Semua"
      ? galleries
      : galleries.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6" ref={galleryRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            GALERI
          </h1>
          <div className="flex gap-4">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-xl border border-slate-200 font-bold"
            >
              <option>Semua</option>
              <option>Projek P5</option>
              <option>Prestasi</option>
              <option>Organisasi</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Urutkan: {sortOrder === "desc" ? "Terbaru" : "Terlama"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="gallery-item bg-white p-4 rounded-4xl shadow-sm border border-slate-100"
            >
              <img
                src={item.imageUrl}
                className="w-full h-75 object-cover rounded-3xl"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.createdAt?.toDate().toLocaleDateString("id-ID")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
