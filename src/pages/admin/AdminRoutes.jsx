import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Toaster } from "react-hot-toast";

import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import AdminNews from "./AdminNews";
import AdminGallery from "./AdminGallery";
import AdminContent from "./AdminContent";
import AdminVideo from "./AdminVideo";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // Atau ganti ke spinner loading
  if (!user) return <Navigate to="/admin" replace />;
  return children;
}

export default function AdminRoutes() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="news"
          element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          }
        />

        <Route
          path="video"
          element={
            <ProtectedRoute>
              <AdminVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="gallery"
          element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="content"
          element={
            <ProtectedRoute>
              <AdminContent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
