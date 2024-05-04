// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyD2XLcsAeOFRxhPtRpyVx3xdpjOjle9nLE",
    authDomain: "codher-2024-wellnest.firebaseapp.com",
    projectId: "codher-2024-wellnest",
    storageBucket: "codher-2024-wellnest.appspot.com",
    messagingSenderId: "920541261855",
    appId: "1:920541261855:web:ff73ad38e5c8f51a5ce52a",
    measurementId: "G-3PESVFY06Q"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firestore
export default db = getFirestore(app);
// Initialize Auth
export const firebase_auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
