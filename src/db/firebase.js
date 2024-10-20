import {
    ref,
    getStorage,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable,
  } from "firebase/storage";
  import {
    doc,
    query,
    where,
    getDoc,
    addDoc,
    limit,
    setDoc,
    orderBy,
    getDocs,
    Timestamp,
    deleteDoc,
    updateDoc,
    onSnapshot,
    collection,
    getFirestore,
    getCountFromServer,
  } from "firebase/firestore";
  import {
    signOut,
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { initializeApp } from "firebase/app";
  
  const firebaseConfig = {
    apiKey: "AIzaSyAjmu6Hcgf1tGuNCB1-MzCPor6hBAegJDY",
  authDomain: "smoto-774ff.firebaseapp.com",
  projectId: "smoto-774ff",
  storageBucket: "smoto-774ff.appspot.com",
  messagingSenderId: "745583564937",
  appId: "1:745583564937:web:d94b48c6f48c1ad1340e58",
  measurementId: "G-8BW5KXZVV9"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  
  export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    uploadBytesResumable,
    GoogleAuthProvider,
    getCountFromServer,
    getDownloadURL,
    uploadBytes,
    onSnapshot,
    collection,
    updateDoc,
    deleteDoc,
    Timestamp,
    database,
    storage,
    getDocs,
    signOut,
    orderBy,
    setDoc,
    getDoc,
    addDoc,
    limit,
    query,
    where,
    auth,
    doc,
    ref,
  };
  