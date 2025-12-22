import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxx172ca9wRE9UAwpnZ375_6EdqadmG0Q",
  authDomain: "blood-donor-a8eca.firebaseapp.com",
  projectId: "blood-donor-a8eca",
  storageBucket: "blood-donor-a8eca.firebasestorage.app",
  messagingSenderId: "361679913196",
  appId: "1:361679913196:web:ad1cf0ae660767b3b9e5c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);