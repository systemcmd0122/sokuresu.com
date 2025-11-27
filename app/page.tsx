"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LoginScreen } from "@/components/login-screen"
import { Header } from "@/components/header"
import { ChatInterface } from "@/components/chat-interface"
import { PostFeed } from "@/components/post-feed"
import { Loader2 } from "lucide-react"

function MainContent() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<"chat" | "feed">("chat")

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "chat" ? <ChatInterface onPostShared={() => setActiveTab("feed")} /> : <PostFeed />}
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}
