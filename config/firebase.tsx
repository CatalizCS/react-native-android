// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbYh35WGGLXWFclqWVOwKn_Bl9BDo3EYM",
  authDomain: "final-lab-ca572.firebaseapp.com",
  projectId: "final-lab-ca572",
  storageBucket: "final-lab-ca572.appspot.com",
  databaseURL:
    "final-lab-ca572-default-rtdb.asia-southeast1.firebasedatabase.app",
  messagingSenderId: "277739482212",
  appId: "1:277739482212:web:4351e4a0b693b8503d4371",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
