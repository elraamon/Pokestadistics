// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd4Y8u0VTg8WiLIubx0G82__SaxpGi_U8",
  authDomain: "pokestadisticsdb.firebaseapp.com",
  projectId: "pokestadisticsdb",
  storageBucket: "pokestadisticsdb.firebasestorage.app",
  messagingSenderId: "994372064664",
  appId: "1:994372064664:web:8ac21c1d6b076b4f1447ed",
  measurementId: "G-FR9QPNMJMT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);