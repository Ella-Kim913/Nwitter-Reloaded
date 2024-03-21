// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB49FinbCYzjbGH--qmleOK8RGcUBKafX0",
    authDomain: "nwitter-reloaded-d4b2e.firebaseapp.com",
    projectId: "nwitter-reloaded-d4b2e",
    storageBucket: "nwitter-reloaded-d4b2e.appspot.com",
    messagingSenderId: "606812465708",
    appId: "1:606812465708:web:74186ed3a1037636ee3f89",
    measurementId: "G-LDLFKCTL3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); //got instance of Authentificaion
export const storage = getStorage(app); // got instance of Storage
export const db = getFirestore(app); //got instance of Database