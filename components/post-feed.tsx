"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { User, Clock, Loader2, MessageSquare, Send, Zap } from "lucide-react"
import {
  subscribeToPublicQuestionsRealtime,
  createPublicQuestion,
  updatePublicQuestionAnswer,
  type PublicQuestion,
} from "@/lib/posts"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"

export function PostFeed() {
  const { user, getDisplayName } = useAuth()
  const [questions, setQuestions] = useState<PublicQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [newQuestion, setNewQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answeringId, setAnsweringId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToPublicQuestionsRealtime((newQuestions) => {
      setQuestions(newQuestions)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const formatDate = (timestamp: PublicQuestion["createdAt"]) => {
    if (!timestamp) return "たった今"
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: ja })
    } catch {
      return "たった今"
    }
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newQuestion.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const questionId = await createPublicQuestion({
        question: newQuestion.trim(),
        userName: getDisplayName(),
        userId: user.uid,
        isAnonymous: user.isAnonymous,
      })

      setNewQuestion("")

      // AIに回答させる
      await generateAIAnswer(questionId, newQuestion.trim())
    } catch (error) {
      console.error("投稿エラー:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateAIAnswer = async (questionId: string, question: string) => {
    setAnsweringId(questionId)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: [],
        }),
      })

      if (!response.ok) throw new Error("API error")

      const data = await response.json()
      await updatePublicQuestionAnswer(questionId, data.response)
    } catch (error) {
      console.error("AI回答エラー:", error)
      await updatePublicQuestionAnswer(questionId, "エラーが発生した。まあ、そういうこともある。")
    } finally {
      setAnsweringId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground">みんなの相談</h2>
          <p className="text-sm text-muted-foreground">みんなの質問にsokuresuが厳しく回答します</p>
        </div>

        <Card className="border-primary/20 bg-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">みんなに相談する</label>
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="質問や相談を入力... sokuresuが厳しく答えます"
                  className="min-h-[100px] resize-none"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  投稿者: {getDisplayName()}
                  {user?.isAnonymous && " (匿名)"}
                </p>
                <Button type="submit" disabled={!newQuestion.trim() || isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      投稿中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      投稿する
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 投稿一覧 */}
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium text-foreground">まだ投稿がありません</p>
            <p className="mt-2 text-sm text-muted-foreground">上のフォームから質問を投稿してみましょう</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card
                key={question.id}
                className="overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{question.userName}</span>
                      {question.isAnonymous && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          匿名
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 質問 */}
                  <div className="rounded-xl bg-primary/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary">
                      <User className="h-3 w-3" />
                      質問
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{question.question}</p>
                  </div>

                  {/* 回答 */}
                  {question.status === "pending" || answeringId === question.id ? (
                    <div className="rounded-xl bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>sokuresuが考え中...</span>
                      </div>
                    </div>
                  ) : question.answer ? (
                    <div className="rounded-xl bg-destructive/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-destructive">
                        <Zap className="h-3 w-3" />
                        sokuresuの厳しい回答
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{question.answer}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
