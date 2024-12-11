// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMAY4zsW7YrtAWjzNWwgn3ZY67TkwNo_s",
  authDomain: "shop-mart-website.firebaseapp.com",
  projectId: "shop-mart-website",
  storageBucket: "shop-mart-website.firebasestorage.app",
  messagingSenderId: "1022461886094",
  appId: "1:1022461886094:web:5ad582143d81cfcc5e93df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };