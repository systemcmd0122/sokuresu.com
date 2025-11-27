"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { hasAcceptedTerms, acceptTerms } from "@/lib/terms-acceptance"
import { TermsDialog } from "@/components/terms-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, User, Chrome, AlertTriangle, MessageSquare } from "lucide-react"

export function LoginScreen() {
  const { signInAnonymous, signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState<"anonymous" | "google" | null>(null)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"anonymous" | "google" | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    setTermsAccepted(hasAcceptedTerms())
  }, [])

  const handleLoginAttempt = (type: "anonymous" | "google") => {
    if (termsAccepted) {
      executeLogin(type)
    } else {
      setPendingAction(type)
      setShowTermsDialog(true)
    }
  }

  const handleTermsAccept = () => {
    acceptTerms()
    setTermsAccepted(true)
    setShowTermsDialog(false)
    if (pendingAction) {
      executeLogin(pendingAction)
      setPendingAction(null)
    }
  }

  const executeLogin = async (type: "anonymous" | "google") => {
    setLoading(type)
    try {
      if (type === "anonymous") {
        await signInAnonymous()
      } else {
        await signInWithGoogle()
      }
    } catch {
      // Error handled in context
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Zap className="h-9 w-9 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
          sokuresu<span className="text-primary">.com</span>
        </h1>
        <p className="text-lg text-muted-foreground">質問や相談にドストレートに即レス</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>厳しめに回答</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>遠慮なし</span>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md border-border bg-card shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-card-foreground">ログイン</CardTitle>
          <CardDescription className="text-sm">匿名またはGoogleアカウントでログイン</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleLoginAttempt("anonymous")}
            disabled={loading !== null}
            className="h-12 w-full border-border bg-transparent text-foreground hover:bg-secondary"
          >
            <User className="mr-2 h-5 w-5" />
            {loading === "anonymous" ? "ログイン中..." : "匿名でログイン"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">または</span>
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => handleLoginAttempt("google")}
            disabled={loading !== null}
            className="h-12 w-full shadow-md"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {loading === "google" ? "ログイン中..." : "Googleでログイン"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">Googleでログインすると、ユーザー名を変更できます</p>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-md text-center">
        <p className="text-sm text-muted-foreground">
          AIが<span className="font-medium text-destructive">厳しく</span>、
          <span className="font-medium text-primary">ドストレート</span>に回答します。
        </p>
        <p className="mt-2 text-xs text-muted-foreground/70">画像の添付はサポートしていません</p>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-primary hover:underline">
            利用規約
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            プライバシーポリシー
          </Link>
        </div>
      </div>

      <TermsDialog open={showTermsDialog} onAccept={handleTermsAccept} />
    </div>
  )
}
