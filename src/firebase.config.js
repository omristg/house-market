// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALaoeSOniw06MxRLMxQTlL2Oy1bai3G50",
    authDomain: "house-market-app-7d756.firebaseapp.com",
    projectId: "house-market-app-7d756",
    storageBucket: "house-market-app-7d756.appspot.com",
    messagingSenderId: "943468345197",
    appId: "1:943468345197:web:520a5532cfcc49c54c0c64"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()