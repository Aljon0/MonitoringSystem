// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmjc-WYrey5ej7VijSG_CYED0X7kjETxU",
  authDomain: "monitoring-system-ea001.firebaseapp.com",
  projectId: "monitoring-system-ea001",
  storageBucket: "monitoring-system-ea001.firebasestorage.app",
  messagingSenderId: "6855438037",
  appId: "1:6855438037:web:4f83ca39d035dfae5dbc5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Google Auth provider
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  db, 
  googleProvider,
  storage 
};