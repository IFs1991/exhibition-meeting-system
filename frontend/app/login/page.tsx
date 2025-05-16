"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import { LoginForm } from "../../components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            ログイン
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            アカウント情報でログインしてください
          </p>
        </div>

        <LoginForm />

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            アカウントをお持ちでない場合は{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              新規登録
            </Link>
            {" "}してください
          </p>
        </div>
      </div>
    </div>
  )
}
