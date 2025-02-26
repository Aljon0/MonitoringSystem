// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
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

// Initialize Google Auth provider
const googleProvider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, firestore, db, googleProvider };
export const storage = getStorage(app);