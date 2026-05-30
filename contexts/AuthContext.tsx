"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, updateProfile as updateAuthProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface User {
  id: string;
  name: string;
  email: string;
  isOnboarded: boolean;
  role?: "user" | "nutricionista";
  crn?: string;
  preferences?: any;
  savedPlans?: any[];
  profilePicture?: string;
  isAppleWatchConnected?: boolean;
  isGoogleFitConnected?: boolean;
  isGarminConnected?: boolean;
  mealReminders?: any[];
  waterReminders?: any;
  hydrationSettings?: { enabled: boolean, interval: number, goal: number };
  recordedMeals?: string[];
  waterIntake?: number;
  activityMinutes?: number;
  sleepHours?: number;
  goalTargetDates?: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  registerNutricionista: (name: string, email: string, crn: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (preferences: any) => Promise<void>;
  connectAppleWatch: () => Promise<void>;
  disconnectAppleWatch: () => Promise<void>;
  connectGoogleFit: () => Promise<void>;
  disconnectGoogleFit: () => Promise<void>;
  connectGarmin: () => Promise<void>;
  disconnectGarmin: () => Promise<void>;
  savePlan: (plan: any) => Promise<void>;
  removePlan: (planId: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleMeal: (mealId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid, firebaseUser.email || '');
      } else {
        setUser(null);
        setIsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (id: string, email: string) => {
    const pathForGetDocs = `profiles/${id}`;
    try {
      const docRef = doc(db, 'profiles', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({ ...(docSnap.data() as User), id, email });
      } else {
        // Force the app to create a new profile by keeping user mapped with required data but not in DB yet
        setUser({
          id,
          name: auth.currentUser?.displayName || email.split('@')[0],
          email,
          isOnboarded: false,
          role: "user"
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, pathForGetDocs);
    } finally {
      setIsLoaded(true);
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      if (password) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw new Error("Password is required for email login");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login: " + (error as Error).message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, silently ignore
        return;
      }
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("Já existe uma conta com este email usando outro método de login (ex: Facebook ou Email).");
        return;
      }
      alert("Erro ao fazer login com Google: " + error.message);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Facebook Login Error:", error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, silently ignore
        return;
      }
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("Já existe uma conta com este email usando outro método de login (ex: Google ou Email).");
        return;
      }
      alert("Erro ao fazer login com Facebook: " + error.message);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      if (password) {
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        await updateAuthProfile(creds.user, { displayName: name });
        // We do not save to DB here; fetchProfile will fake the user state 
        // until the onboarding is completed.
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ login_hint: email, prompt: 'select_account' });
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar: " + (error as Error).message);
    }
  };

  const registerNutricionista = async (name: string, email: string, crn: string, password?: string) => {
    try {
      let userId = "";
      if (password) {
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        await updateAuthProfile(creds.user, { displayName: name });
        userId = creds.user.uid;
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ login_hint: email, prompt: 'select_account' });
        const creds = await signInWithPopup(auth, provider);
        userId = creds.user.uid;
      }
      
      const pathForCreate = `profiles/${userId}`;
      await setDoc(doc(db, 'profiles', userId), {
        name,
        email,
        isOnboarded: true,
        role: "nutricionista",
        crn
      });

      setUser({
        id: userId,
        name,
        email,
        isOnboarded: true,
        role: "nutricionista",
        crn
      });
      router.push("/dashboard-nutricionista");

    } catch (error) {
      console.error(error);
      alert("Erro ao registrar nutricionista: " + (error as Error).message);
    }
  };

  const completeOnboarding = async (preferences: any) => {
    if (!user) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const pathForWrite = `profiles/${userId}`;
    try {
      await setDoc(doc(db, 'profiles', userId), {
        name: user.name,
        email: user.email,
        isOnboarded: true,
        role: user.role || 'user',
        preferences
      }, { merge: true });

      setUser({ ...user, isOnboarded: true, preferences });
      if (user.role === 'nutricionista') {
        router.push("/dashboard-nutricionista");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    }
  };

  const connectAppleWatch = async () => {};
  const disconnectAppleWatch = async () => {};
  const connectGoogleFit = async () => {};
  const disconnectGoogleFit = async () => {};
  const connectGarmin = async () => {};
  const disconnectGarmin = async () => {};
  const savePlan = async (plan: any) => {
    if (!user) return;
    const userId = user.id;
    const pathForWrite = `profiles/${userId}`;
    try {
      const currentPlans = user.savedPlans || [];
      // avoid duplicates or override by id if needed, but since it's just pushing let's push
      const updatedPlans = [...currentPlans, plan];
      await updateDoc(doc(db, 'profiles', userId), {
        savedPlans: updatedPlans
      });
      setUser({ ...user, savedPlans: updatedPlans });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    }
  };

  const removePlan = async (planId: string) => {
    if (!user) return;
    const userId = user.id;
    const pathForWrite = `profiles/${userId}`;
    try {
      const updatedPlans = (user.savedPlans || []).filter((p: any) => p.id !== planId);
      await updateDoc(doc(db, 'profiles', userId), {
        savedPlans: updatedPlans
      });
      setUser({ ...user, savedPlans: updatedPlans });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    }
  };
  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const userId = user.id;
      const pathForWrite = `profiles/${userId}`;
      try {
        await updateDoc(doc(db, 'profiles', userId), {
          ...data
        });
        setUser({ ...user, ...data });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, pathForWrite);
      }
    }
  };
  const toggleMeal = async (mealId: string) => {};

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Error:", e);
    }
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    if (isLoaded) {
      if (pathname?.startsWith("/dashboard")) {
        if (!user) {
          router.push("/login");
        } else if (user.role === 'nutricionista' && !pathname.startsWith("/dashboard-nutricionista")) {
          router.push("/dashboard-nutricionista");
        } else if (user.role !== 'nutricionista' && pathname.startsWith("/dashboard-nutricionista")) {
          router.push("/dashboard");
        } else if (!user.isOnboarded && user.role !== 'nutricionista') {
          router.push("/onboarding");
        }
      }

      if (pathname === "/onboarding") {
        if (!user) {
          router.push("/login");
        } else if (user.role === 'nutricionista') {
          router.push("/dashboard-nutricionista");
        } else if (user.isOnboarded) {
          router.push("/dashboard");
        }
      }
      
      if (pathname === "/login" && user) {
        if (user.role === 'nutricionista') {
          router.push("/dashboard-nutricionista");
        } else if (user.isOnboarded) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    }
  }, [user, pathname, isLoaded, router]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      login,
      loginWithGoogle,
      loginWithFacebook,
      register,
      registerNutricionista,
      logout,
      completeOnboarding,
      connectAppleWatch,
      disconnectAppleWatch,
      connectGoogleFit,
      disconnectGoogleFit,
      connectGarmin,
      disconnectGarmin,
      savePlan,
      removePlan,
      updateProfile,
      toggleMeal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
