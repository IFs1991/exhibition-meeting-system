"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { ExhibitionDetail, Exhibition } from "@/components/exhibition-detail"
import { exhibitionAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// 関連するクライアント型定義
interface Client {
  id: string
  companyName: string
  name: string
  email: string
}

// 商談予約の型定義
interface Meeting {
  id: string
  clientId: string
  clientName: string
  companyName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "canceled"
}

export default function ExhibitionDetailPage() {
  const { id } = useParams()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [relatedClients, setRelatedClients] = useState<Client[]>([])
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchExhibitionData = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        // 展示会詳細を取得
        const { exhibition } = await exhibitionAPI.getById(id as string)
        setExhibition(exhibition)

        // 関連クライアントと商談も取得
        // 実際のAPIでは、関連データも一緒に返すか、別のエンドポイントから取得する
        try {
          const clientsResponse = await exhibitionAPI.getRelatedClients(id as string)
          setRelatedClients(clientsResponse.clients)
        } catch (error) {
          console.error("関連クライアント取得エラー:", error)
        }

        try {
          const meetingsResponse = await exhibitionAPI.getScheduledMeetings(id as string)
          setScheduledMeetings(meetingsResponse.meetings)
        } catch (error) {
          console.error("予約商談取得エラー:", error)
        }
      } catch (error) {
        console.error("展示会詳細取得エラー:", error)
        toast({
          title: "エラーが発生しました",
          description: "展示会情報の取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExhibitionData()
  }, [id, toast])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Skeleton className="h-64 rounded-md" />
              <Skeleton className="h-64 rounded-md" />
            </div>
          </div>
        ) : exhibition ? (
          <ExhibitionDetail
            exhibition={exhibition}
            relatedClients={relatedClients}
            scheduledMeetings={scheduledMeetings}
            isAdmin={true}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">展示会情報が見つかりませんでした</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
