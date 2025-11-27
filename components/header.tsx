"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { UserSettingsModal } from "@/components/user-settings-modal"
import { LogoutDialog } from "@/components/logout-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Zap, MessageSquare, Globe, Settings, ChevronDown, FileText, Shield } from "lucide-react"
import { clearAllLocalChatSessions } from "@/lib/local-chat-storage"

interface HeaderProps {
  activeTab: "chat" | "feed"
  onTabChange: (tab: "chat" | "feed") => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, signOut, getDisplayName } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const displayName = getDisplayName()
  const isAnonymous = user?.isAnonymous

  const handleLogoutConfirm = async () => {
    if (isAnonymous) {
      await clearAllLocalChatSessions()
    }
    signOut()
    setLogoutDialogOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight">sokuresu</span>
              <span className="text-[10px] leading-none text-muted-foreground">.com</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1">
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("chat")}
              className={`gap-2 rounded-lg transition-all ${
                activeTab === "chat" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">相談する</span>
            </Button>
            <Button
              variant={activeTab === "feed" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("feed")}
              className={`gap-2 rounded-lg transition-all ${
                activeTab === "feed" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">みんなの相談</span>
            </Button>
          </nav>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-lg px-3 hover:bg-secondary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden max-w-[100px] truncate text-sm sm:inline">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border bg-card">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{isAnonymous ? "匿名ユーザー" : "Googleアカウント"}</p>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                {!isAnonymous && (
                  <DropdownMenuItem
                    onClick={() => setSettingsOpen(true)}
                    className="cursor-pointer text-foreground focus:bg-secondary"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    ユーザー設定
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild className="cursor-pointer text-foreground focus:bg-secondary">
                  <Link href="/terms" target="_blank">
                    <FileText className="mr-2 h-4 w-4" />
                    利用規約
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-foreground focus:bg-secondary">
                  <Link href="/privacy" target="_blank">
                    <Shield className="mr-2 h-4 w-4" />
                    プライバシーポリシー
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={() => setLogoutDialogOpen(true)}
                  className="cursor-pointer text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <UserSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        isAnonymous={isAnonymous ?? false}
      />
    </>
  )
}
