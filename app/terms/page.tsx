import type { Metadata } from "next"
import { Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "利用規約 | sokuresu.com",
  description: "sokuresu.comの利用規約とサービス条件について",
  robots: "index, follow",
}

export default function TermsPage() {
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
        <h1 className="mb-8 text-3xl font-bold">利用規約</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">1. はじめに</h2>
            <p className="text-muted-foreground leading-relaxed">
              この利用規約（以下「本規約」）は、sokuresu.com（以下「当サービス」）の利用条件を定めるものです。
              ユーザーは本規約に同意した上で当サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">2. サービスの内容</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                当サービスは、AIを活用した相談・質問回答サービスを提供します。 AIは
                <span className="font-medium text-destructive">率直かつ厳しい回答</span>を行うことを特徴としています。
              </p>
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <p className="font-medium text-destructive">重要な注意事項</p>
                <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
                  <li>AIの回答は参考情報であり、専門的なアドバイスではありません</li>
                  <li>医療、法律、金融に関する重要な判断は専門家にご相談ください</li>
                  <li>AIの回答が厳しい表現を含む場合があります</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">3. アカウント</h2>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>ユーザーは匿名またはGoogleアカウントでログインできます</li>
              <li>Googleアカウントユーザーはチャット履歴の保存、ユーザー名の変更が可能です</li>
              <li>アカウント情報の正確性はユーザーの責任となります</li>
              <li>他者のアカウントを不正に使用することは禁止されています</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">4. 禁止事項</h2>
            <p className="mb-4 text-muted-foreground">以下の行為は禁止されています：</p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>他のユーザーへの嫌がらせ、誹謗中傷</li>
              <li>虚偽の情報を流布する行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>不正アクセス、ハッキング行為</li>
              <li>AIを悪用して有害なコンテンツを生成させる行為</li>
              <li>自動化ツールを使用した大量リクエスト</li>
              <li>商用目的での無断利用</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">5. 投稿コンテンツ</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>「みんなの相談」に投稿されたコンテンツについて：</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>投稿内容は他のユーザーに公開されます</li>
                <li>個人を特定できる情報の投稿は避けてください</li>
                <li>不適切な投稿は予告なく削除される場合があります</li>
                <li>投稿内容の責任はユーザーにあります</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">6. 知的財産権</h2>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>当サービスのロゴ、デザイン、コードの著作権は運営者に帰属します</li>
              <li>ユーザーの投稿内容の著作権はユーザーに帰属します</li>
              <li>ただし、サービス提供のために必要な範囲で利用を許諾いただきます</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">7. 免責事項</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>当サービスは以下について責任を負いません：</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>AIの回答の正確性、完全性、有用性</li>
                <li>サービスの中断、遅延、データの損失</li>
                <li>ユーザー間のトラブル</li>
                <li>外部サービス（Firebase、Gemini API等）の障害</li>
                <li>サービス利用により生じた損害</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">8. サービスの変更・終了</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、事前の通知なくサービス内容の変更、一時停止、終了を行う場合があります。
              これによりユーザーに生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">9. 規約の変更</h2>
            <p className="text-muted-foreground leading-relaxed">
              本規約は必要に応じて変更されることがあります。
              変更後のサービス利用をもって、変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-primary">10. 準拠法・管轄</h2>
            <p className="text-muted-foreground leading-relaxed">
              本規約は日本法に準拠し、サービスに関する紛争は日本国内の裁判所を専属的合意管轄とします。
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
