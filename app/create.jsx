// firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";

import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCl8m8Y1LXiqAHqjtri43bLZNCcFjgqIC4",
  authDomain: "nexa-25062.firebaseapp.com",
  projectId: "nexa-25062",
  storageBucket: "nexa-25062.appspot.com", // ✅ fixed earlier
  messagingSenderId: "351808144897",
  appId: "1:351808144897:web:4675b9dc0425138e736200",
  measurementId: "G-S23M6VGSP0"
};

// ✅ Initialize app safely (prevents duplicate app error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Setup Auth
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
} else {
  // initializeAuth should also be guarded (to avoid duplicate initialization)
  if (getApps().length === 0) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
}

// ✅ Setup Firestore
const db = getFirestore(app);

export { auth, db };
