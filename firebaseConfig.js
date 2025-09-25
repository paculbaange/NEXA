// firebase.js

import { initializeApp } from "firebase/app";
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
  storageBucket: "nexa-25062.appspot.com", // ✅ fixed here
  messagingSenderId: "351808144897",
  appId: "1:351808144897:web:4675b9dc0425138e736200",
  measurementId: "G-S23M6VGSP0"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// ✅ Setup Auth
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence); // ✅ fixed persistence
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// ✅ Setup Firestore
const db = getFirestore(app);

export { auth, db };
