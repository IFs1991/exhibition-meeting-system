"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  PlusCircle,
  Search,
  CalendarDays,
  Clock,
  Building
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { meetingAPI, exhibitionAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// 商談予約の型定義
interface Meeting {
  id: string
  exhibitionId: string
  exhibitionName: string
  date: string
  startTime: string
  endTime: string
  status: "pending" | "confirmed" | "canceled"
  purpose?: string
  notes?: string
}

// 展示会の型定義
interface Exhibition {
  id: string
  name: string
  venue: string
  startDate: string
  endDate: string
  status: "planning" | "active" | "completed" | "canceled"
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // 商談とアクティブな展示会一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // 商談一覧を取得
        const meetingsResponse = await meetingAPI.getAll()
        setMeetings(meetingsResponse.meetings)
        setFilteredMeetings(meetingsResponse.meetings)

        // アクティブな展示会一覧を取得
        const exhibitionsResponse = await exhibitionAPI.getAll({
          status: "active",
          limit: 5
        })
        setExhibitions(exhibitionsResponse.exhibitions)
      } catch (error) {
        console.error("データ取得エラー:", error)
        toast({
          title: "エラーが発生しました",
          description: "商談情報の取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // 検索とフィルタリング
  useEffect(() => {
    let filtered = [...meetings]

    // ステータスフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter(meeting => meeting.status === statusFilter)
    }

    // テキスト検索
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        meeting =>
          meeting.exhibitionName.toLowerCase().includes(lowerCaseQuery) ||
          (meeting.purpose && meeting.purpose.toLowerCase().includes(lowerCaseQuery))
      )
    }

    setFilteredMeetings(filtered)
  }, [searchQuery, statusFilter, meetings])

  // 商談ステータスに応じたバッジを表示
  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">確定</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">保留中</Badge>
      case "canceled":
        return <Badge variant="destructive">キャンセル</Badge>
    }
  }

  // 商談詳細ページに移動
  const handleViewDetail = (meetingId: string) => {
    router.push(`/client/meetings/${meetingId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">商談一覧</h1>
          <p className="text-muted-foreground mt-1">現在の商談予約状況を確認できます</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/client/meetings/new">
            <Button variant="default">新規商談予約</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商談検索・フィルター</CardTitle>
          <CardDescription>展示会名や商談目的で検索、ステータスでフィルタリングできます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="展示会名、商談目的で検索..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue={statusFilter} className="w-full sm:w-[200px]" onValueChange={setStatusFilter}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">全て</TabsTrigger>
                <TabsTrigger value="confirmed" className="flex-1">確定</TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">保留中</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">予約済み商談</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMeetings.length > 0 ? (
            <div className="grid gap-4">
              {filteredMeetings.map((meeting) => (
                <Card key={meeting.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{meeting.exhibitionName}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground text-sm">
                            <div className="flex items-center">
                              <CalendarDays className="mr-1 h-4 w-4" />
                              <span>{formatDate(meeting.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                            </div>
                          </div>
                          {meeting.purpose && (
                            <p className="mt-2 text-sm line-clamp-2">{meeting.purpose}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(meeting.status)}
                          <Button variant="outline" size="sm" onClick={() => handleViewDetail(meeting.id)}>
                            詳細
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">予約済み商談がありません</p>
                <Button asChild className="mt-4">
                  <Link href="/client/meetings/new">商談を予約する</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">開催中の展示会</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : exhibitions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exhibitions.map((exhibition) => (
                <Card key={exhibition.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg">{exhibition.name}</h3>
                      <div className="flex flex-col gap-2 mt-2 text-muted-foreground text-sm">
                        <div className="flex items-center">
                          <Building className="mr-1 h-4 w-4" />
                          <span>{exhibition.venue}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button asChild size="sm" variant="outline" className="w-full">
                          <Link href={`/client/meetings/new?exhibitionId=${exhibition.id}`}>
                            この展示会の商談を予約
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">現在開催中の展示会はありません</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
