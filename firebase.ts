import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyBv2JknYUzm-Gmq611h87hr9uZRtHZLXVs",
  authDomain: "fir-auth-fbdb4.firebaseapp.com",
  projectId: "fir-auth-fbdb4",
  storageBucket: "fir-auth-fbdb4.firebasestorage.app",
  messagingSenderId: "466063923091",
  appId: "1:466063923091:web:eed34600416fee7fdbba66",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
