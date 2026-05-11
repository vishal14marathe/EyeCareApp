// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiG-JA8_hwHWn11nQ1kezplQghfDGQm4w",
  authDomain: "form-d9e00.firebaseapp.com",
  databaseURL: "https://form-d9e00-default-rtdb.firebaseio.com",
  projectId: "form-d9e00",
  storageBucket: "form-d9e00.firebasestorage.app",
  messagingSenderId: "1034906339338",
  appId: "1:1034906339338:web:3bf4adcbe5faedfa0b37f3",
  measurementId: "G-CH8RQDWDK1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
