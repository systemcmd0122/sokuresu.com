"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, FileText, Shield, ExternalLink } from "lucide-react"

interface TermsDialogProps {
  open: boolean
  onAccept: () => void
}

export function TermsDialog({ open, onAccept }: TermsDialogProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [agreedToAI, setAgreedToAI] = useState(false)

  const canAccept = agreedToTerms && agreedToPrivacy && agreedToAI

  const handleAccept = () => {
    if (canAccept) {
      onAccept()
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg gap-0 p-0 [&>button]:hidden">
        <DialogHeader className="border-b border-border p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            利用規約への同意
          </DialogTitle>
          <DialogDescription>sokuresu.comをご利用いただくには、以下の規約に同意してください</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-6 p-6">
            {/* AI Warning */}
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-destructive">
                <AlertTriangle className="h-4 w-4" />
                AIの回答について
              </div>
              <p className="text-sm text-muted-foreground">
                当サービスのAIは<span className="font-medium text-foreground">率直かつ厳しい回答</span>を行います。
                回答は参考情報であり、専門的なアドバイスではありません。 重要な判断は必ず専門家にご相談ください。
              </p>
            </div>

            {/* Terms Summary */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    利用規約
                  </div>
                  <Link
                    href="/terms"
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    全文を読む
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>・ サービスの適切な利用</li>
                  <li>・ 禁止事項の遵守</li>
                  <li>・ 投稿内容への責任</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <Shield className="h-4 w-4 text-primary" />
                    プライバシーポリシー
                  </div>
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    全文を読む
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>・ 個人情報の収集と利用</li>
                  <li>・ データの保存方法</li>
                  <li>・ 第三者サービスの利用</li>
                </ul>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm">
                  <Link href="/terms" target="_blank" className="font-medium text-primary hover:underline">
                    利用規約
                  </Link>
                  に同意します
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm">
                  <Link href="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 transition-colors hover:bg-destructive/10">
                <Checkbox
                  id="ai"
                  checked={agreedToAI}
                  onCheckedChange={(checked) => setAgreedToAI(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm">
                  AIが<span className="font-medium text-destructive">厳しく率直な回答</span>を行うことを理解し、
                  回答は参考情報であることに同意します
                </span>
              </label>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border p-6 pt-4">
          <Button onClick={handleAccept} disabled={!canAccept} className="w-full" size="lg">
            {canAccept ? "同意して利用を開始" : "すべての項目に同意してください"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
