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

export default function ClientEditPage({ params }: { params: { id: string } }) {
  const [clientData, setClientData] = useState<Partial<ClientFormData>>({})
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const clientId = Number.parseInt(params.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // 実際の実装ではAPIからデータを取得
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 800))

        // モック展示会データ
        const mockExhibitions: Exhibition[] = [
          { id: 1, name: "東京ビジネスエキスポ2023" },
          { id: 2, name: "大阪産業フェア2023" },
          { id: 3, name: "名古屋テクノロジーショー2023" },
          { id: 4, name: "福岡ITフェスティバル2023" },
          { id: 5, name: "札幌ビジネスEXPO2023" },
        ]

        // モッククライアントデータ
        const mockClientData: ClientFormData = {
          id: clientId,
          companyName: "株式会社テクノソリューション",
          contactPerson: "山田太郎",
          email: "yamada@techno-solution.co.jp",
          industry: "IT・通信",
          phone: "03-1234-5678",
          website: "https://techno-solution.co.jp",
          address: "東京都渋谷区〇〇町1-2-3",
          status: "active",
          exhibitions: [1, 3], // 展示会IDの配列
          notes: "大手IT企業。新規プロジェクトの提案に興味あり。",
        }

        setExhibitions(mockExhibitions)
        setClientData(mockClientData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "エラーが発生しました",
          description: "データの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clientId, toast])

  const handleSubmit = async (data: ClientFormData) => {
    try {
      // 実際の実装ではAPIにデータを送信
      console.log("Submitting data:", data)
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "保存しました",
        description: "クライアント情報が更新されました。",
      })

      // 詳細ページに戻る
      router.push(`/admin/clients/${clientId}`)
    } catch (error) {
      console.error("Failed to update client:", error)
      toast({
        title: "エラーが発生しました",
        description: "クライアント情報の更新に失敗しました。",
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
            <Link href={`/admin/clients/${clientId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">クライアント編集</h1>
        </div>
        <p className="text-muted-foreground">クライアント情報を編集します</p>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <ClientForm
            initialData={clientData}
            exhibitions={exhibitions}
            onSubmit={handleSubmit}
            submitButtonText="更新する"
            isEdit={true}
          />
        )}
      </div>
    </AdminLayout>
  )
}
