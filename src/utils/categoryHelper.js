// src/utils/categoryHelper.js

export const getCategoryBadge = (category) => {
  const cat = category?.toUpperCase();
  switch (cat) {
    case "PRESTASI":
      return {
        icon: "🏆",
        color:
          "bg-amber-500/10 text-amber-700 border-amber-500/20 backdrop-blur-md",
      };
    case "PENGUMUMAN":
      return {
        icon: "📢",
        color:
          "bg-blue-500/10 text-blue-700 border-blue-500/20 backdrop-blur-md",
      };
    case "KEGIATAN":
      return {
        icon: "📅",
        color:
          "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 backdrop-blur-md",
      };
    case "AKADEMIK":
      return {
        icon: "📚",
        color:
          "bg-indigo-500/10 text-indigo-700 border-indigo-500/20 backdrop-blur-md",
      };
    case "EKSTRAKURIKULER":
      return {
        icon: "⚽",
        color:
          "bg-purple-500/10 text-purple-700 border-purple-500/20 backdrop-blur-md",
      };
    case "ARTIKEL":
      return {
        icon: "✍️",
        color:
          "bg-rose-500/10 text-rose-700 border-rose-500/20 backdrop-blur-md",
      };
    case "BERITA":
      return {
        icon: "📌",
        color: "bg-sky-500/10 text-sky-700 border-sky-500/20 backdrop-blur-md",
      };
    default:
      return {
        icon: "📌",
        color:
          "bg-slate-500/10 text-slate-700 border-slate-500/20 backdrop-blur-md",
      };
  }
};

export const getCategoryColor = (cat) => {
  const upperCat = cat?.toUpperCase();
  switch (upperCat) {
    case "PRESTASI":
      return "bg-emerald-50 text-emerald-600";
    case "PENGUMUMAN":
      return "bg-blue-50 text-blue-600";
    case "KEGIATAN":
      return "bg-purple-50 text-purple-600";
    case "AKADEMIK":
      return "bg-indigo-50 text-indigo-600";
    case "EKSTRAKURIKULER":
      return "bg-purple-50 text-purple-600";
    case "ARTIKEL":
      return "bg-rose-50 text-rose-600";
    case "BERITA":
      return "bg-sky-50 text-sky-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
};
