import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDTzc8MkAhkk1R0HDHi6mv2hsCI0m_KeXg",

  authDomain: "caud-app.firebaseapp.com",

  projectId: "caud-app",

  storageBucket: "caud-app.appspot.com",

  messagingSenderId: "444214436607",

  appId: "1:444214436607:web:6b0e9f0cc63a1b0d7022ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
