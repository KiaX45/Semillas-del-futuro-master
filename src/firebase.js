
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3ED-E1bTujIXzAnyrhYA-DMFmw1Cn-ic",
  authDomain: "takiyfinal.firebaseapp.com",
  projectId: "takiyfinal",
  storageBucket: "takiyfinal.appspot.com",
  messagingSenderId: "532091286529",
  appId: "1:532091286529:web:f71de28aa687cc7472fc00",
  measurementId: "G-JVF5JWKCKR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//Usuarios
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


//Firebase
const db = getFirestore(app);

export{auth, provider, db};

//Storage
export const storage = getStorage(app);




