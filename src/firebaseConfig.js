import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Substitua com os dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZcJEOK6tj8Ap52CMzJTUlJaK-HP4oGjw",
  authDomain: "proj2-409c2.firebaseapp.com",
  projectId: "proj2-409c2",
  storageBucket: "proj2-409c2.firebasestorage.app",
  messagingSenderId: "252236434066",
  appId: "1:252236434066:web:2bb763a93de7525901344b",
  measurementId: "G-R3Y6FX9GN1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
