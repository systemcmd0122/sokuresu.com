"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Check } from "lucide-react"

interface UserSettingsModalProps {
  open: boolean
  onClose: () => void
}

export function UserSettingsModal({ open, onClose }: UserSettingsModalProps) {
  const { profile, updateDisplayName, getDisplayName } = useAuth()
  const [displayName, setDisplayName] = useState(getDisplayName())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!displayName.trim()) return
    setSaving(true)
    try {
      await updateDisplayName(displayName.trim())
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error("保存エラー:", error)
    } finally {
      setSaving(false)
    }
  }

  const isAnonymous = profile?.isAnonymous

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">ユーザー設定</DialogTitle>
          <DialogDescription>
            {isAnonymous
              ? "匿名ユーザーは名前を変更できません。Googleでログインしてください。"
              : "表示名を自由に変更できます。"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-foreground">
              表示名
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力"
              disabled={isAnonymous || saving}
              className="bg-input text-foreground"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              {isAnonymous ? "Googleアカウントでログインすると名前を変更できます" : "最大20文字まで"}
            </p>
          </div>

          {!isAnonymous && (
            <div className="space-y-2">
              <Label className="text-foreground">メールアドレス</Label>
              <p className="text-sm text-muted-foreground">{profile?.email || "未設定"}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isAnonymous || saving || !displayName.trim()}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                保存しました
              </>
            ) : (
              "保存"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
