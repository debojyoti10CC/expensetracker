import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, User } from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHURDfk5mr-STW83asOwVrqFGAa-wZjMA",
  authDomain: "expense-tracker-bb74c.firebaseapp.com",
  projectId: "expense-tracker-bb74c",
  storageBucket: "expense-tracker-bb74c.firebasestorage.app",
  messagingSenderId: "873737705174",
  appId: "1:873737705174:web:fab109ceec5b2fdbfb1b77",
  measurementId: "G-QM3WL9J89S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email: string, password: string, name: string): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (name && userCredential.user) {
    await updateProfile(userCredential.user, { displayName: name });
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };
};

export const subscribeAuth = (callback: (user: AuthUser | null) => void): () => void => {
  return onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
};

export const getIsMock = () => false;