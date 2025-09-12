// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase web app config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCP23sHT2p9lvVtw4Lj-voqL4ccJpuJ6FQ",
  authDomain: "palawan-collective-console.firebaseapp.com",
  databaseURL: "https://palawan-collective-console-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palawan-collective-console",
  storageBucket: "palawan-collective-console.appspot.com",
  messagingSenderId: "738243500004",
  appId: "1:738243500004:web:3f91280f7f8189eed9f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
