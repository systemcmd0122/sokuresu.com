"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Zap, User, Share2, Check, AlertTriangle, Save, History, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createPost } from "@/lib/posts"
import {
  saveChatSession,
  getUserChatSessions,
  deleteChatSession,
  deleteAllUserChatSessions,
  type ChatSession,
  type ChatMessage,
} from "@/lib/chat-history"
import {
  saveLocalChatSession,
  getLocalChatSessions,
  deleteLocalChatSession,
  clearAllLocalChatSessions,
  type LocalChatSession,
} from "@/lib/local-chat-storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  onPostShared?: () => void
}

export function ChatInterface({ onPostShared }: ChatInterfaceProps) {
  const { user, getDisplayName } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sharingIndex, setSharingIndex] = useState<number | null>(null)
  const [sharedIndexes, setSharedIndexes] = useState<Set<number>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [chatHistory, setChatHistory] = useState<(ChatSession | LocalChatSession)[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isGoogleUser = user && !user.isAnonymous
  const isAnonymousUser = user?.isAnonymous

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadHistory = async () => {
    if (!user) return
    setLoadingHistory(true)
    try {
      if (isGoogleUser) {
        const sessions = await getUserChatSessions(user.uid)
        setChatHistory(sessions)
      } else {
        const sessions = await getLocalChatSessions()
        setChatHistory(sessions)
      }
    } catch (error) {
      console.error("履歴読み込みエラー:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSaveChat = async () => {
    if (!user || messages.length === 0) return
    setIsSaving(true)
    try {
      if (isGoogleUser) {
        await saveChatSession(user.uid, messages as ChatMessage[])
      } else {
        await saveLocalChatSession(messages)
      }
      await loadHistory()
    } catch (error) {
      console.error("保存エラー:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadSession = (session: ChatSession | LocalChatSession) => {
    setMessages(session.messages)
    setShowHistory(false)
    setSharedIndexes(new Set())
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      if (isGoogleUser) {
        await deleteChatSession(sessionId)
      } else {
        await deleteLocalChatSession(sessionId)
      }
      setChatHistory((prev) => prev.filter((s) => s.id !== sessionId))
    } catch (error) {
      console.error("削除エラー:", error)
    }
  }

  const handleDeleteAllHistory = async () => {
    if (!user) return
    setIsDeletingAll(true)
    try {
      if (isGoogleUser) {
        await deleteAllUserChatSessions(user.uid)
      } else {
        await clearAllLocalChatSessions()
      }
      setChatHistory([])
      setDeleteAllDialogOpen(false)
    } catch (error) {
      console.error("全削除エラー:", error)
    } finally {
      setIsDeletingAll(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    const userMessage: Message = { role: "user", content: trimmedInput }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("API error")
      }

      const data = await response.json()
      const assistantMessage: Message = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("チャットエラー:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "エラーが発生した。もう一度試せ。",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleShare = async (questionIndex: number) => {
    if (!user || sharingIndex !== null) return

    const question = messages[questionIndex]
    const answer = messages[questionIndex + 1]

    if (!question || !answer || answer.role !== "assistant") return

    setSharingIndex(questionIndex)

    try {
      await createPost({
        question: question.content,
        answer: answer.content,
        userName: getDisplayName(),
        userId: user.uid,
        isAnonymous: user.isAnonymous,
      })

      setSharedIndexes((prev) => new Set(prev).add(questionIndex))
      onPostShared?.()
    } catch (error) {
      console.error("シェアエラー:", error)
    } finally {
      setSharingIndex(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setSharedIndexes(new Set())
  }

  const formatDate = (session: ChatSession | LocalChatSession) => {
    if ("createdAt" in session && typeof session.createdAt === "number") {
      return new Date(session.createdAt).toLocaleDateString("ja-JP")
    }
    if ("createdAt" in session && session.createdAt?.toDate) {
      return session.createdAt.toDate().toLocaleDateString("ja-JP")
    }
    return ""
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border bg-muted/30 px-4 py-2">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNewChat} className="gap-2 text-xs bg-transparent">
              新しい相談
            </Button>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveChat}
                disabled={isSaving}
                className="gap-2 text-xs bg-transparent"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                {isAnonymousUser ? "ローカル保存" : "保存"}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowHistory(!showHistory)
              if (!showHistory) loadHistory()
            }}
            className="gap-2 text-xs"
          >
            <History className="h-3 w-3" />
            履歴
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="border-b border-border bg-background px-4 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{isAnonymousUser ? "ローカル保存した履歴" : "保存した相談履歴"}</h3>
              {chatHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteAllDialogOpen(true)}
                  className="gap-2 text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  全削除
                </Button>
              )}
            </div>
            {loadingHistory ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                読み込み中...
              </div>
            ) : chatHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">保存した履歴はありません</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {chatHistory.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <button onClick={() => handleLoadSession(session)} className="flex-1 text-left">
                      <p className="text-sm font-medium truncate">{session.messages[0]?.content.slice(0, 50)}...</p>
                      <p className="text-xs text-muted-foreground">
                        {session.messages.length}件のメッセージ • {formatDate(session)}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">sokuresuへようこそ</h2>
              <p className="mb-4 max-w-md text-muted-foreground">
                質問や相談を入力してください。
                <br />
                <span className="font-medium text-destructive">厳しく</span>、
                <span className="font-medium text-primary">ドストレート</span>に即レスします。
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>甘えた質問には容赦なく返します</span>
              </div>

              {isGoogleUser && (
                <p className="mt-6 text-sm text-muted-foreground/70">
                  Googleアカウントでログイン中: 相談履歴をクラウドに保存できます
                </p>
              )}

              {isAnonymousUser && (
                <p className="mt-6 text-sm text-muted-foreground/70">
                  匿名ログイン中: 相談履歴はこのブラウザにローカル保存されます
                </p>
              )}

              <p className="mt-2 text-sm text-muted-foreground/70">回答をみんなにシェアすることもできます</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-md">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div className="flex max-w-[75%] flex-col gap-2">
                  <Card
                    className={`px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-2xl rounded-tl-sm bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </Card>
                  {message.role === "assistant" && index > 0 && messages[index - 1]?.role === "user" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(index - 1)}
                      disabled={sharingIndex !== null || sharedIndexes.has(index - 1)}
                      className="self-start gap-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {sharedIndexes.has(index - 1) ? (
                        <>
                          <Check className="h-3 w-3" />
                          シェア済み
                        </>
                      ) : sharingIndex === index - 1 ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          シェア中...
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3 w-3" />
                          みんなにシェア
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-md">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <Card className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>考え中...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-background/95 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-3 px-4 py-4">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="質問や相談を入力... 厳しく答えます"
            className="min-h-[52px] max-h-[200px] flex-1 resize-none rounded-xl border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="lg"
            disabled={!input.trim() || isLoading}
            className="h-[52px] rounded-xl px-6 shadow-md"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="pb-4 text-center text-xs text-muted-foreground">Enter で送信 / Shift + Enter で改行</p>
      </div>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>全ての履歴を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              この操作は取り消せません。保存した全ての相談履歴が
              {isAnonymousUser ? "このブラウザから" : "クラウドから"}完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAllHistory}
              disabled={isDeletingAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                "全て削除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
