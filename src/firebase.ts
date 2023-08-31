import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBh_lLFpb-nCeJOJf7CgJ3GZeRTLKGYrCk",
    authDomain: "techpack-b6389.firebaseapp.com",
    databaseURL: "https://techpack-b6389-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "techpack-b6389",
    storageBucket: "techpack-b6389.appspot.com",
    messagingSenderId: "123493634862",
    appId: "1:123493634862:web:9caac68fc5439ccd6020bf",
    measurementId: "G-4MG2F9KSXT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

