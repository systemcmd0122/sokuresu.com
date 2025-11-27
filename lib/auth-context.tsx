"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"
import { getOrCreateUserProfile, updateCustomDisplayName, type UserProfile } from "./user-profile"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signInAnonymous: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  getDisplayName: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user && !user.isAnonymous) {
        const userProfile = await getOrCreateUserProfile(user.uid, {
          displayName: user.displayName || "ユーザー",
          email: user.email,
          isAnonymous: false,
        })
        setProfile(userProfile)
      } else if (user && user.isAnonymous) {
        setProfile({
          uid: user.uid,
          displayName: "匿名ユーザー",
          email: null,
          isAnonymous: true,
          customDisplayName: null,
          createdAt: null,
          updatedAt: null,
        })
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInAnonymous = async () => {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.error("匿名ログインエラー:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Googleログインエラー:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("ログアウトエラー:", error)
      throw error
    }
  }

  const updateDisplayName = async (name: string) => {
    if (!user || user.isAnonymous) return
    await updateCustomDisplayName(user.uid, name)
    setProfile((prev) => (prev ? { ...prev, customDisplayName: name } : null))
  }

  const getDisplayName = () => {
    if (!profile) return "ユーザー"
    if (profile.isAnonymous) return "匿名ユーザー"
    return profile.customDisplayName || profile.displayName || "ユーザー"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInAnonymous,
        signInWithGoogle,
        signOut,
        updateDisplayName,
        getDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
