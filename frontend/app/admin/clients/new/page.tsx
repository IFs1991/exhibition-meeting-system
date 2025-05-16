"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { ClientForm, type ClientFormData } from "@/components/client-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// 展示会データの型定義
interface Exhibition {
  id: number
  name: string
}

export default function NewClientPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true)
        // 実際の実装ではAPIからデータを取得
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 600))

        // モック展示会データ
        const mockExhibitions: Exhibition[] = [
          { id: 1, name: "東京ビジネスエキスポ2023" },
          { id: 2, name: "大阪産業フェア2023" },
          { id: 3, name: "名古屋テクノロジーショー2023" },
          { id: 4, name: "福岡ITフェスティバル2023" },
          { id: 5, name: "札幌ビジネスEXPO2023" },
        ]

        setExhibitions(mockExhibitions)
      } catch (error) {
        console.error("Failed to fetch exhibitions:", error)
        toast({
          title: "エラーが発生しました",
          description: "展示会データの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExhibitions()
  }, [toast])

  const handleSubmit = async (data: ClientFormData) => {
    try {
      // 実際の実装ではAPIにデータを送信
      console.log("Submitting data:", data)
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "登録しました",
        description: "新しいクライアントが登録されました。",
      })

      // クライアント一覧ページに戻る
      router.push("/admin/clients")
    } catch (error) {
      console.error("Failed to create client:", error)
      toast({
        title: "エラーが発生しました",
        description: "クライアントの登録に失敗しました。",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">新規クライアント登録</h1>
        </div>
        <p className="text-muted-foreground">新しいクライアントを登録します</p>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <ClientForm exhibitions={exhibitions} onSubmit={handleSubmit} submitButtonText="登録する" isEdit={false} />
        )}
      </div>
    </AdminLayout>
  )
}
