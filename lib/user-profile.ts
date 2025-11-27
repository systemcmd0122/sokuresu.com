import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type Timestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface UserProfile {
  uid: string
  displayName: string
  email: string | null
  isAnonymous: boolean
  customDisplayName: string | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

const USERS_COLLECTION = "users"

// ユーザープロフィールを取得または作成
export async function getOrCreateUserProfile(uid: string, defaultData: Partial<UserProfile>): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return { uid, ...userSnap.data() } as UserProfile
  }

  const newProfile = {
    displayName: defaultData.displayName || "ユーザー",
    email: defaultData.email || null,
    isAnonymous: defaultData.isAnonymous || false,
    customDisplayName: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(userRef, newProfile)
  return { uid, ...newProfile, createdAt: null, updatedAt: null } as UserProfile
}

// カスタム表示名を更新
export async function updateCustomDisplayName(uid: string, customDisplayName: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid)
  await updateDoc(userRef, {
    customDisplayName,
    updatedAt: serverTimestamp(),
  })
}

// ユーザープロフィールを取得
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return { uid, ...userSnap.data() } as UserProfile
  }
  return null
}
