import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
  limit,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Post {
  id: string
  question: string
  answer: string
  userName: string
  userId: string
  isAnonymous: boolean
  createdAt: Timestamp | null
  likes: number
}

export interface PostInput {
  question: string
  answer: string
  userName: string
  userId: string
  isAnonymous: boolean
}

export interface PublicQuestion {
  id: string
  question: string
  answer: string | null
  userName: string
  userId: string
  isAnonymous: boolean
  status: "pending" | "answered"
  createdAt: Timestamp | null
}

export interface PublicQuestionInput {
  question: string
  userName: string
  userId: string
  isAnonymous: boolean
}

const POSTS_COLLECTION = "posts"
const PUBLIC_QUESTIONS_COLLECTION = "publicQuestions"

// 投稿を作成（チャットからシェア用）
export async function createPost(input: PostInput): Promise<string> {
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    likes: 0,
  })
  return docRef.id
}

export async function createPublicQuestion(input: PublicQuestionInput): Promise<string> {
  const docRef = await addDoc(collection(db, PUBLIC_QUESTIONS_COLLECTION), {
    ...input,
    answer: null,
    status: "pending",
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updatePublicQuestionAnswer(questionId: string, answer: string): Promise<void> {
  const { doc, updateDoc } = await import("firebase/firestore")
  await updateDoc(doc(db, PUBLIC_QUESTIONS_COLLECTION, questionId), {
    answer,
    status: "answered",
  })
}

// リアルタイムで投稿を取得
export function subscribeToPostsRealtime(callback: (posts: Post[]) => void, limitCount = 50) {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"), limit(limitCount))

  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[]
    callback(posts)
  })
}

export function subscribeToPublicQuestionsRealtime(callback: (questions: PublicQuestion[]) => void, limitCount = 50) {
  const q = query(collection(db, PUBLIC_QUESTIONS_COLLECTION), orderBy("createdAt", "desc"), limit(limitCount))

  return onSnapshot(q, (snapshot) => {
    const questions: PublicQuestion[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PublicQuestion[]
    callback(questions)
  })
}
