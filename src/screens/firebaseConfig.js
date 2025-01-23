// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDDPVkcJ1jU3sSspDv2y4mfjevK0f16ahI",
  authDomain: "login-tutor-960af.firebaseapp.com",
  databaseURL: "https://login-tutor-960af-default-rtdb.firebaseio.com/",
  projectId: "login-tutor-960af",
  storageBucket: "login-tutor-960af.firebasestorage.app",
  messagingSenderId: "537119981746",
  appId: "1:537119981746:web:d36d0f5ae9831bc7e509ab",
  measurementId: "G-ZF4HSQ76RQ",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getDatabase(app);

export { db };
