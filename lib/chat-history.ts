import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

const CHAT_SESSIONS_COLLECTION = "chatSessions"

// チャットセッションを保存（Googleユーザーのみ）
export async function saveChatSession(userId: string, messages: ChatMessage[]): Promise<string> {
  const docRef = await addDoc(collection(db, CHAT_SESSIONS_COLLECTION), {
    userId,
    messages,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

// ユーザーのチャット履歴を取得
export async function getUserChatSessions(userId: string): Promise<ChatSession[]> {
  const q = query(collection(db, CHAT_SESSIONS_COLLECTION), orderBy("createdAt", "desc"))

  const snapshot = await getDocs(q)
  const sessions: ChatSession[] = []

  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.userId === userId) {
      sessions.push({
        id: doc.id,
        ...data,
      } as ChatSession)
    }
  })

  return sessions
}

// チャットセッションを削除
export async function deleteChatSession(sessionId: string): Promise<void> {
  await deleteDoc(doc(db, CHAT_SESSIONS_COLLECTION, sessionId))
}

// ユーザーの全チャット履歴を削除
export async function deleteAllUserChatSessions(userId: string): Promise<void> {
  const sessions = await getUserChatSessions(userId)
  const batch = writeBatch(db)

  sessions.forEach((session) => {
    batch.delete(doc(db, CHAT_SESSIONS_COLLECTION, session.id))
  })

  await batch.commit()
}
