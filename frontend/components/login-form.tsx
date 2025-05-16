"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(email, password);
      // ログイン後のリダイレクト処理
      // ユーザーロールに基づいて適切なダッシュボードにリダイレクト
      if (response?.user?.role === "admin") {
        console.log("管理者としてログイン成功: /admin/dashboard へリダイレクト");
        router.push("/admin/dashboard");
      } else if (response?.user?.role === "client") {
        console.log("クライアントとしてログイン成功: /client/dashboard へリダイレクト");

        // 画面遷移を確実に行うため、直接location.hrefを使用
        window.location.href = "/client/dashboard";
      } else {
        console.error("不明なユーザーロール:", response?.user?.role);
        // 不明なロールの場合もクライアントダッシュボードへ
        window.location.href = "/client/dashboard";
      }
    } catch (error) {
      // エラー処理はuseAuthのコンテキスト内で行われるため、ここでは何もしない
      console.error("ログインエラー:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        <CardDescription>メールアドレスとパスワードを入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">パスワード</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground mb-1">※デモ用ログイン情報:</p>
        <p className="text-sm text-muted-foreground">管理者: admin@example.com / password123</p>
        <p className="text-sm text-muted-foreground">クライアント: client@example.com / password123</p>
      </CardFooter>
    </Card>
  );
}