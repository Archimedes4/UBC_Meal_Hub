// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk1dP4nkpFt_WSgJ3ZTlaV84f4NOtykJg",
  authDomain: "ubc-meal-hub.firebaseapp.com",
  projectId: "ubc-meal-hub",
  storageBucket: "ubc-meal-hub.appspot.com",
  messagingSenderId: "641900113874",
  appId: "1:641900113874:web:9eca9dbe6f12fd0637220b",
  measurementId: "G-RR95CN43NN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app);