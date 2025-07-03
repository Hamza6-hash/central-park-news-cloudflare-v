import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvPFjSipxWQybxJiihqf9CZl_Nv_wkMPE",
    authDomain: "blackacre-media-properties.firebaseapp.com",
    projectId: "blackacre-media-properties",
    storageBucket: "blackacre-media-properties.appspot.com",
    messagingSenderId: "950868454403",
    appId: "1:950868454403:web:9542eba58b5092a230f236"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
