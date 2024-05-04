// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDs-ew4gvL6vGOk6ygmeg8zR-xzGpN1Htw",
  authDomain: "wellnest-ab850.firebaseapp.com",
  databaseURL: "https://wellnest-ab850-default-rtdb.firebaseio.com",
  projectId: "wellnest-ab850",
  storageBucket: "wellnest-ab850.appspot.com",
  messagingSenderId: "424293342157",
  appId: "1:424293342157:web:6af80627c2c498b5808284",
  measurementId: "G-YMWGRMVYSW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firestore
export default db = getFirestore(app);
// Initialize Auth
export const firebase_auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
