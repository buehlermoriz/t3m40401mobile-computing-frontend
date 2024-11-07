import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACiRlsizMKTF-po6H3c0InfHsLlI8cs4Y",
    authDomain: "t3m404011-mobile-computing.firebaseapp.com",
    databaseURL: "https://t3m404011-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "t3m404011-mobile-computing",
    storageBucket: "t3m404011-mobile-computing.firebasestorage.app",
    messagingSenderId: "891612150654",
    appId: "1:891612150654:web:203c0c897a35141e51512f"
}

const app = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(app)
const firebaseFirestore = getFirestore(app)

export {firebaseAuth, firebaseFirestore}