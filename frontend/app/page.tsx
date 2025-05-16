import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">展示会商談予約システム</h1>
          <p className="text-muted-foreground">効率的な商談管理で展示会の成果を最大化</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>ログイン</CardTitle>
            <CardDescription>メールアドレスとパスワードでログインしてください</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">ログイン画面へ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
