"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function ClientIndexPage() {
  // サーバー側のリダイレクト
  redirect("/client/dashboard")

  // クライアント側のフォールバック（JavaScript無効時にも動作するよう）
  useEffect(() => {
    window.location.href = "/client/dashboard"
  }, [])

  // この部分は実行されないが、念のためレンダリング
  return null
}