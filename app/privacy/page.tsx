import type { Metadata } from "next"
import { Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "プライバシーポリシー | sokuresu.com",
  description: "sokuresu.comのプライバシーポリシーと個人情報の取り扱いについて",
  robots: "index, follow",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">sokuresu.com</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">1. はじめに</h2>
            <p className="text-muted-foreground leading-relaxed">
              sokuresu.com（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
              本プライバシーポリシーは、当サービスがどのように情報を収集、使用、保護するかを説明しています。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">2. 収集する情報</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="mb-2 font-medium text-foreground">2.1 アカウント情報</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Googleアカウントでログインした場合：メールアドレス、表示名、プロフィール画像URL</li>
                  <li>匿名ログインの場合：一時的な識別子のみ</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-foreground">2.2 利用データ</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>相談内容およびAIの回答</li>
                  <li>投稿したコンテンツ</li>
                  <li>サービスの利用状況</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">3. 情報の使用目的</h2>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>サービスの提供および改善</li>
              <li>ユーザー体験のパーソナライズ</li>
              <li>チャット履歴の保存（Googleログインユーザーのみ）</li>
              <li>投稿コンテンツの公開表示</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">4. データの保存</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Googleアカウントユーザー：</span>
                チャット履歴およびユーザー設定はFirebase Firestoreに保存されます。
              </p>
              <p>
                <span className="font-medium text-foreground">匿名ユーザー：</span>
                チャット履歴はブラウザのローカルストレージ（IndexedDB）に保存され、サーバーには送信されません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">5. 第三者への提供</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
            </p>
            <ul className="ml-4 mt-2 list-disc space-y-1 text-muted-foreground">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>サービス提供に必要な範囲で業務委託先に提供する場合</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">6. 外部サービス</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>当サービスは以下の外部サービスを利用しています：</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>
                  <span className="font-medium text-foreground">Firebase（Google）</span>：認証、データベース
                </li>
                <li>
                  <span className="font-medium text-foreground">Gemini API（Google）</span>：AI回答の生成
                </li>
                <li>
                  <span className="font-medium text-foreground">Vercel Analytics</span>：アクセス解析
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">7. ユーザーの権利</h2>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>チャット履歴の削除</li>
              <li>アカウントの削除要求</li>
              <li>個人情報の開示請求</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">8. セキュリティ</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、ユーザーの情報を保護するために適切な技術的・組織的措置を講じています。
              ただし、インターネット上の完全なセキュリティを保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">9. ポリシーの変更</h2>
            <p className="text-muted-foreground leading-relaxed">
              本プライバシーポリシーは、必要に応じて変更されることがあります。
              重要な変更がある場合は、サービス内で通知します。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">10. お問い合わせ</h2>
            <p className="text-muted-foreground leading-relaxed">
              本ポリシーに関するお問い合わせは、サービス内のフィードバック機能をご利用ください。
            </p>
          </section>

          <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            <p>最終更新日: 2025年1月</p>
          </div>
        </div>
      </main>
    </div>
  )
}
