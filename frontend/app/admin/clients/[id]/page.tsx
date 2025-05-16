"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { ClientDetail } from "@/components/client-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// クライアントデータの型定義
interface Client {
  id: number
  companyName: string
  contactPerson: string
  email: string
  industry: string
  phone?: string
  website?: string
  address?: string
  status: "active" | "inactive"
  exhibitions: {
    id: number
    name: string
  }[]
  meetingCount: number
  notes?: string
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const clientId = Number.parseInt(params.id)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        // 実際の実装ではAPIからデータを取得
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 800))

        // モックデータ
        const mockClient: Client = {
          id: clientId,
          companyName: "株式会社テクノソリューション",
          contactPerson: "山田太郎",
          email: "yamada@techno-solution.co.jp",
          industry: "IT・通信",
          phone: "03-1234-5678",
          website: "https://techno-solution.co.jp",
          address: "東京都渋谷区〇〇町1-2-3",
          status: "active",
          exhibitions: [
            { id: 1, name: "東京ビジネスエキスポ2023" },
            { id: 3, name: "名古屋テクノロジーショー2023" },
          ],
          meetingCount: 12,
          notes: "大手IT企業。新規プロジェクトの提案に興味あり。",
        }

        setClient(mockClient)
      } catch (error) {
        console.error("Failed to fetch client:", error)
        toast({
          title: "エラーが発生しました",
          description: "クライアント情報の取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (clientId) {
      fetchClient()
    }
  }, [clientId, toast])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/clients">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">クライアント詳細</h1>
            </div>
            <p className="text-muted-foreground">クライアントの詳細情報を表示します</p>
          </div>
          <Button
            className="mt-4 sm:mt-0 flex items-center gap-2"
            onClick={() => router.push(`/admin/clients/${clientId}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            編集
          </Button>
        </div>

        <ClientDetail client={client as Client} isLoading={isLoading} />
      </div>
    </AdminLayout>
  )
}
