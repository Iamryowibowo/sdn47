import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Data config asli dari project sdn47 kamu
const firebaseConfig = {
  apiKey: "AIzaSyCnn4mPSVCMmJ1X1cm5iH8Y0SM6R49iVME",
  authDomain: "sdn47-b7335.firebaseapp.com",
  projectId: "sdn47-b7335",
  storageBucket: "sdn47-b7335.firebasestorage.app",
  messagingSenderId: "95789105259",
  appId: "1:95789105259:web:f6421a92c388ceb774712e",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor fitur Auth dan Database agar bisa dipakai di Login.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);
