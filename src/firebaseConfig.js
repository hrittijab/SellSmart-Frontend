import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDsdoqDBP1oh_xdKhXdybHLfvIH2YkAZVE",
  authDomain: "sellsmart-26fa8.firebaseapp.com",
  projectId: "sellsmart-26fa8",
  storageBucket: "sellsmart-26fa8.firebasestorage.app",
  messagingSenderId: "743044485733",
  appId: "1:743044485733:web:35596d45e04b12bfce2c8c",
  measurementId: "G-D7VY6JQLSF"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
