import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithPopup as fbSignInWithPopup,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  signOut as fbSignOut,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  sendEmailVerification as fbSendEmailVerification,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  getIdToken as fbGetIdToken
} from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Ensure session persists between refreshes
setPersistence(auth, browserLocalPersistence).catch(console.error);

export const onAuthStateChanged = fbOnAuthStateChanged;
export const signInWithPopup = fbSignInWithPopup;
export const signInWithEmailAndPassword = fbSignInWithEmailAndPassword;
export const signOut = fbSignOut;
export const createUserWithEmailAndPassword = fbCreateUserWithEmailAndPassword;
export const sendPasswordResetEmail = fbSendPasswordResetEmail;
export const sendEmailVerification = fbSendEmailVerification;
export const updateProfile = fbUpdateProfile;
export const getIdToken = fbGetIdToken;
export const googleProvider = new GoogleAuthProvider();

// Optional App Check (disable if not ready)
export let appCheckInstance: AppCheck | null = null;
try {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    const inst = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckInstance = inst;
  }
} catch (e) {
  console.warn("App Check init failed:", e);
}
