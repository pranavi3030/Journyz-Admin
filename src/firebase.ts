// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjEllaGk7oVdT4iyw-YLroPlsR-HbAxYk",
  authDomain: "journyz-customer-maturity.firebaseapp.com",
  projectId: "journyz-customer-maturity",
  storageBucket: "journyz-customer-maturity.appspot.com",
  messagingSenderId: "122033663044",
  appId: "1:122033663044:web:9c8767e0b747623193a011",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
