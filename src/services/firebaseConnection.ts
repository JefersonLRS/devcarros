
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA8UzpcVXLf0gMmKq3fLoXV57jL_Tkqp4U",
  authDomain: "devcarros-5c981.firebaseapp.com",
  projectId: "devcarros-5c981",
  storageBucket: "devcarros-5c981.appspot.com",
  messagingSenderId: "1021944711164",
  appId: "1:1021944711164:web:ec2a73ee96b55854bfd479"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }