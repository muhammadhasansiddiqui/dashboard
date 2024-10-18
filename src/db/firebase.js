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
    apiKey: "AIzaSyBfG89mVj7MMYcbbxFCegr1_pP1_5reohg",
    authDomain: "scrapp-ee304.firebaseapp.com",
    projectId: "scrapp-ee304",
    storageBucket: "scrapp-ee304.appspot.com",
    messagingSenderId: "549058211742",
    appId: "1:549058211742:web:e0758007110b9fac90308f"
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
  