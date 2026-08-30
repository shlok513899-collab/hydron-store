import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { CustomerProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: CustomerProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, pass: string) => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (data: Partial<CustomerProfile>) => Promise<void>;
  setAdminOverride?: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAIL = 'admin@hydron.com';
export const ADMIN_PASSWORD = 'admin@7096862987';

const ADMIN_STORAGE_KEY = 'hydron_admin_authenticated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<CustomerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Helper to fetch/create user profile in Firestore
  const syncUserProfile = async (user: User, extraData?: { name?: string; mobile?: string }) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const isMasterAdmin = (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

      if (userSnap.exists()) {
        const data = userSnap.data() as CustomerProfile;
        const finalRole = (isMasterAdmin || data.role === 'admin') ? 'admin' : 'customer';
        setUserProfile({ ...data, role: finalRole });
        if (isMasterAdmin) {
          setIsAdmin(true);
          try { localStorage.setItem(ADMIN_STORAGE_KEY, 'true'); } catch {}
        }
      } else {
        const newProfile: CustomerProfile = {
          uid: user.uid,
          name: extraData?.name || user.displayName || 'Hydron Customer',
          email: user.email || '',
          mobile: extraData?.mobile || user.phoneNumber || '',
          role: isMasterAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0,
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        if (isMasterAdmin) {
          setIsAdmin(true);
          try { localStorage.setItem(ADMIN_STORAGE_KEY, 'true'); } catch {}
        }
      }
    } catch (err) {
      console.warn('Error fetching Firestore user profile, defaulting to basic auth data:', err);
      const isMasterAdmin = (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      if (isMasterAdmin) {
        setIsAdmin(true);
        try { localStorage.setItem(ADMIN_STORAGE_KEY, 'true'); } catch {}
      }
      setUserProfile({
        uid: user.uid,
        name: user.displayName || 'Hydron Customer',
        email: user.email || '',
        mobile: user.phoneNumber || '',
        role: isMasterAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
        // Only clear admin if not authenticated through explicit admin login
        const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
        if (!storedAdmin) {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserProfile(cred.user);
  };

  const loginAdmin = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || cleanPass !== ADMIN_PASSWORD) {
      throw new Error('Invalid administrator credentials! Access denied. Only authorized personnel can access the Admin Panel.');
    }

    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    } catch {}
    
    setIsAdmin(true);

    // Try firebase auth in background if user exists
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    } catch {
      // If account doesn't exist in Firebase Auth yet, try creating or fallback
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      } catch {
        // Fallback local admin profile
        setUserProfile({
          uid: 'admin-master',
          name: 'Hydron Administrator',
          email: ADMIN_EMAIL,
          mobile: '919876543210',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  const register = async (name: string, email: string, mobile: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      await syncUserProfile(cred.user, { name, mobile });
    }
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
  };

  const logoutAdmin = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {}
    setIsAdmin(false);
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    setUserProfile(null);
  };

  const logout = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {}
    setIsAdmin(false);
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<CustomerProfile>) => {
    if (!currentUser) throw new Error('User not logged in');
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        error,
        clearError,
        login,
        loginAdmin,
        register,
        logout,
        logoutAdmin,
        resetPassword,
        signInWithGoogle,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
