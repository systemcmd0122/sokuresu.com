// 匿名ユーザー用のローカルストレージ（IndexedDB）

const DB_NAME = "sokuresu_local_db"
const DB_VERSION = 1
const STORE_NAME = "chat_sessions"

export interface LocalChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface LocalChatSession {
  id: string
  messages: LocalChatMessage[]
  createdAt: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("createdAt", "createdAt", { unique: false })
      }
    }
  })
}

// ローカルにチャットセッションを保存
export async function saveLocalChatSession(messages: LocalChatMessage[]): Promise<string> {
  const db = await openDB()
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const session: LocalChatSession = {
    id,
    messages,
    createdAt: Date.now(),
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(session)

    request.onsuccess = () => resolve(id)
    request.onerror = () => reject(request.error)
  })
}

// ローカルのチャット履歴を取得
export async function getLocalChatSessions(): Promise<LocalChatSession[]> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index("createdAt")
    const request = index.openCursor(null, "prev")

    const sessions: LocalChatSession[] = []

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        sessions.push(cursor.value)
        cursor.continue()
      } else {
        resolve(sessions)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

// ローカルのチャットセッションを削除
export async function deleteLocalChatSession(sessionId: string): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(sessionId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ローカルの全チャット履歴を削除
export async function clearAllLocalChatSessions(): Promise<void> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
