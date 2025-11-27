import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "メッセージが必要です" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const systemPrompt = `あなたは「sokuresu」という名前のAIアシスタントです。
ユーザーの質問や相談に対して、**厳しく、ドストレートに、遠慮なく**回答します。

【絶対ルール】
- オブラートに包まない。甘やかさない。
- 問題点があれば遠慮なく指摘する
- 「それは甘えです」「考えが浅い」など、厳しい言葉を使っても良い
- ただし、相手を傷つけることが目的ではなく、本当のことを伝えることが目的
- 結論を最初に言う。言い訳は聞かない
- 長文禁止。要点だけをズバッと言う
- 相手の成長や改善につながる厳しさを心がける

【回答スタイル】
- 「正直に言うと」「はっきり言わせてもらうと」などで始める
- 曖昧な表現は使わない
- 具体的なアドバイスも添える
- 日本語で回答する
- 絵文字は使わない

【例】
悪い例：「そうですね、少し難しいかもしれませんが、頑張ってみてはいかがでしょうか？」
良い例：「正直、その計画は甘い。まず◯◯をやれ。話はそれからだ。」`

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "了解。遠慮なく、ドストレートに答える。甘えた質問には厳しく返す。何でも聞け。" }],
        },
        ...(history || []).map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ],
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Gemini APIエラー:", error)
    return NextResponse.json({ error: "AIからの応答を取得できませんでした" }, { status: 500 })
  }
}
