"use client"

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

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isAnonymous: boolean
}

export function LogoutDialog({ open, onOpenChange, onConfirm, isAnonymous }: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {isAnonymous ? (
              <>
                匿名ユーザーのため、ログアウトすると
                <span className="font-medium text-destructive">ローカルに保存されたチャット履歴が削除</span>
                されます。
              </>
            ) : (
              <>
                Googleアカウントからログアウトします。
                <br />
                保存した相談履歴は次回ログイン時に復元できます。
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            ログアウト
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
