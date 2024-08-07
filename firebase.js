// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuDhDYu5yZiClitoC2FMFSsPBK8nYqYPw",
  authDomain: "inventory-tracker-632ad.firebaseapp.com",
  projectId: "inventory-tracker-632ad",
  storageBucket: "inventory-tracker-632ad.appspot.com",
  messagingSenderId: "810939446993",
  appId: "1:810939446993:web:8623ab5eebe6a677b6b7f0",
  measurementId: "G-NQFVRNRVG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);


export {firestore}