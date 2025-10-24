import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { 
    auth, 
    onAuthStateChanged, 
    googleProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification
} from './services/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import api from './services/api';
import { useNotification } from './NotificationContext';

// Application-specific user profile
interface AppUser {
  id: string; // Firebase UID
  name: string;
  email: string;
  role: 'user' | 'admin';
  credits: number;
  plan_id: string;
  subscription_status: 'active' | 'inactive';
  is_verified: boolean; // Synced from Firebase email_verified
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  isLoading: boolean;
  updateUser: (data: Partial<AppUser>) => void;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  // Fix: Added fetchCurrentUser to the context type to allow components to refresh user data.
  fetchCurrentUser: () => Promise<AppUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Failed to fetch app user profile:", error);
      // This might happen if the user is new, so we don't necessarily log out
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, get their app-specific profile from our backend
        await fetchCurrentUser();
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchCurrentUser]);


  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    // Trigger backend to create user profile. The name is not available in the token yet,
    // but the backend will handle it. We can also update the firebase profile, but
    // the backend getOrCreateUser is the source of truth for the app DB.
    await fetchCurrentUser();
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
    } else {
        throw new Error("No user is currently signed in.");
    }
  };

  const updateUser = useCallback((data: Partial<AppUser>) => {
    setUser(currentUser => currentUser ? { ...currentUser, ...data } : null);
  }, []);

  return (
    // Fix: Added fetchCurrentUser to the context provider value.
    <AuthContext.Provider value={{ user, firebaseUser, login, signup, logout, isLoading, updateUser, loginWithGoogle, sendPasswordReset, resendVerificationEmail, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};