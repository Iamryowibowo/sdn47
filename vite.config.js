import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Biru elegan khas instansi pendidikan
        secondary: "#fbbf24", // Aksen kuning emas
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Pastikan kamu mengimpor font Inter di HTML nanti
      },
    },
  },
});
