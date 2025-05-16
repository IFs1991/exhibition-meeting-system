import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ログイン | 展示会商談管理システム",
  description: "アカウント情報でログインしてください",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}