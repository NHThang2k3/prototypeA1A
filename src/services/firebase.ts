// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Thay thế bằng thông tin từ Firebase Console của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDYrwJu-Op7UuwZXRvs2Yw2716DKcKLi9Q",
  authDomain: "ip-tracking-484a5.firebaseapp.com",
  databaseURL: "https://ip-tracking-484a5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ip-tracking-484a5",
  storageBucket: "ip-tracking-484a5.firebasestorage.app",
  messagingSenderId: "360001262684",
  appId: "1:360001262684:web:64e2597a7b667ac2694299",
  measurementId: "G-EH2ZY883H5"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);