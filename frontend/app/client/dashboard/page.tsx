"use client"

import { useEffect, useState } from "react"
import ClientLayout from "@/components/client-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useCompany } from "@/contexts/company-context"
import { Skeleton } from "@/components/ui/skeleton"

// 商談データの型定義
interface Meeting {
  id: number
  companyName: string
  contactPerson: string
  industry: string
  time: string
  meetUrl: string
  status: "confirmed" | "pending" | "cancelled"
}

export default function ClientDashboard() {
  const { activeExhibition, isLoading } = useCompany()
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [todayMeetings, setTodayMeetings] = useState<Meeting[]>([])
  const [tomorrowMeetings, setTomorrowMeetings] = useState<Meeting[]>([])
  const [stats, setStats] = useState<{ name: string; value: string; description: string }[]>([])

  // データ取得のシミュレーション
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true)
        // 実際の実装ではAPIからデータを取得
        await new Promise((resolve) => setTimeout(resolve, 600))

        // 今日の商談データ
        setTodayMeetings([
          {
            id: 1,
            companyName: "株式会社テクノソリューション",
            contactPerson: "山田太郎",
            industry: "IT・通信",
            time: "10:30 - 11:00",
            meetUrl: "https://meet.google.com/abc-defg-hij",
            status: "confirmed",
          },
          {
            id: 2,
            companyName: "グローバル商事株式会社",
            contactPerson: "佐藤花子",
            industry: "商社",
            time: "14:00 - 14:30",
            meetUrl: "https://meet.google.com/xyz-abcd-efg",
            status: "confirmed",
          },
        ])

        // 明日の商談データ
        setTomorrowMeetings([
          {
            id: 3,
            companyName: "未来工業株式会社",
            contactPerson: "鈴木一郎",
            industry: "製造",
            time: "11:00 - 11:30",
            meetUrl: "https://meet.google.com/hij-klmn-opq",
            status: "confirmed",
          },
          {
            id: 4,
            companyName: "エコシステム株式会社",
            contactPerson: "田中誠",
            industry: "環境・エネルギー",
            time: "13:00 - 13:30",
            meetUrl: "https://meet.google.com/rst-uvwx-yz",
            status: "confirmed",
          },
          {
            id: 5,
            companyName: "ヘルスケア株式会社",
            contactPerson: "伊藤健太",
            industry: "医療・ヘルスケア",
            time: "15:30 - 16:00",
            meetUrl: "https://meet.google.com/abc-123-xyz",
            status: "pending",
          },
        ])

        // 統計データ
        setStats([
          { name: "本日の商談", value: "2", description: "2023/10/15" },
          { name: "明日の商談", value: "3", description: "2023/10/16" },
          { name: "総商談数", value: "12", description: activeExhibition?.name || "展示会未選択" },
        ])
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsDataLoading(false)
      }
    }

    if (!isLoading) {
      fetchData()
    }
  }, [isLoading, activeExhibition])

  // ローディング状態の表示
  if (isLoading || isDataLoading) {
    return (
      <ClientLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-72 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">クライアントダッシュボード</h1>
          {/* 会社名と展示会名はClientLayoutから取得されるようになりました */}
        </div>

        {/* 統計カード */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.name} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <CardDescription>{stat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/client/meetings/new">
            <Button className="flex items-center gap-2 transition-all hover:shadow-md">
              <PlusCircle className="h-4 w-4" />
              新規商談予約
            </Button>
          </Link>
        </div>

        {/* 今日の商談 */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <CardTitle>本日の商談</CardTitle>
            </div>
            <CardDescription>2023年10月15日の商談予定</CardDescription>
          </CardHeader>
          <CardContent>
            {todayMeetings.length > 0 ? (
              <div className="space-y-4">
                {todayMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-lg border p-4 transition-all hover:border-primary hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{meeting.companyName}</h3>
                        <div className="text-sm text-muted-foreground">
                          担当: {meeting.contactPerson} | 業種: {meeting.industry}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge variant={meeting.status === "confirmed" ? "default" : "outline"}>
                          {meeting.status === "confirmed" ? "確定" : "未確定"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {meeting.time}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <a
                          href={meeting.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors"
                        >
                          Google Meetで参加
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">本日の商談予定はありません</div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/client/meetings" className="text-sm text-muted-foreground hover:underline transition-colors">
              すべての商談を表示
            </Link>
          </CardFooter>
        </Card>

        {/* 明日の商談 */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <CardTitle>明日の商談</CardTitle>
            </div>
            <CardDescription>2023年10月16日の商談予定</CardDescription>
          </CardHeader>
          <CardContent>
            {tomorrowMeetings.length > 0 ? (
              <div className="space-y-4">
                {tomorrowMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="rounded-lg border p-4 transition-all hover:border-primary hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{meeting.companyName}</h3>
                        <div className="text-sm text-muted-foreground">
                          担当: {meeting.contactPerson} | 業種: {meeting.industry}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge variant={meeting.status === "confirmed" ? "default" : "outline"}>
                          {meeting.status === "confirmed" ? "確定" : "未確定"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                        {meeting.time}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <a
                          href={meeting.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors"
                        >
                          Google Meetで参加
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">明日の商談予定はありません</div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/client/meetings" className="text-sm text-muted-foreground hover:underline transition-colors">
              すべての商談を表示
            </Link>
          </CardFooter>
        </Card>
      </div>
    </ClientLayout>
  )
}
