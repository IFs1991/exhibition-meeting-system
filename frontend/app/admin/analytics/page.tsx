"use client"

import { useState, useEffect, useMemo, memo } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts"
import { statsAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// 業種別商談数のデータ
const industryMeetingData = [
  { name: "IT・通信", value: 35, color: "#8884d8" },
  { name: "製造", value: 25, color: "#83a6ed" },
  { name: "商社", value: 18, color: "#8dd1e1" },
  { name: "金融・保険", value: 15, color: "#82ca9d" },
  { name: "建設・不動産", value: 12, color: "#a4de6c" },
  { name: "医療・ヘルスケア", value: 10, color: "#d0ed57" },
  { name: "その他", value: 27, color: "#ffc658" },
]

// 日付別商談数のデータ
const dailyMeetingData = [
  { date: "10/15", count: 12 },
  { date: "10/16", count: 19 },
  { date: "10/17", count: 15 },
  { date: "10/18", count: 8 },
  { date: "10/19", count: 14 },
  { date: "10/20", count: 10 },
  { date: "10/21", count: 7 },
]

// クライアント別商談数のデータ
const clientMeetingData = [
  { name: "株式会社テクノソリューション", count: 12 },
  { name: "グローバル商事株式会社", count: 8 },
  { name: "未来工業株式会社", count: 15 },
  { name: "エコシステム株式会社", count: 7 },
  { name: "ヘルスケア株式会社", count: 5 },
]

// 商談ステータス別のデータ
const statusData = [
  { name: "確定", value: 65, color: "#4ade80" },
  { name: "未確定", value: 25, color: "#facc15" },
  { name: "キャンセル", value: 10, color: "#f87171" },
]

// 時間帯別商談数のデータ
const timeSlotData = [
  { time: "9:00-10:00", count: 8 },
  { time: "10:00-11:00", count: 12 },
  { time: "11:00-12:00", count: 15 },
  { time: "13:00-14:00", count: 10 },
  { time: "14:00-15:00", count: 18 },
  { time: "15:00-16:00", count: 14 },
  { time: "16:00-17:00", count: 7 },
]

// 展示会データ
const exhibitions = [
  { id: "all", name: "すべての展示会" },
  { id: "1", name: "東京ビジネスエキスポ2023" },
  { id: "2", name: "大阪産業フェア2023" },
  { id: "3", name: "名古屋テクノロジーショー2023" },
]

// カスタムツールチップコンポーネント
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

// 2. チャートコンポーネントをメモ化
const PieChartComponent = memo(({ data, title, description }: { data: any[]; title: string; description: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})
PieChartComponent.displayName = "PieChartComponent"

const BarChartComponent = memo(
  ({
    data,
    title,
    description,
    layout = "horizontal",
    dataKey = "value",
    nameKey = "name",
    barName = "商談数",
  }: {
    data: any[]
    title: string
    description: string
    layout?: "vertical" | "horizontal"
    dataKey?: string
    nameKey?: string
    barName?: string
  }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout={layout}
                margin={{
                  top: 5,
                  right: 30,
                  left: layout === "vertical" ? 80 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {layout === "vertical" ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey={nameKey} type="category" width={80} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey={nameKey} />
                    <YAxis />
                  </>
                )}
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} name={barName} fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  },
)
BarChartComponent.displayName = "BarChartComponent"

const LineChartComponent = memo(
  ({
    data,
    title,
    description,
    dataKey = "count",
    nameKey = "date",
    lineName = "商談数",
  }: { data: any[]; title: string; description: string; dataKey?: string; nameKey?: string; lineName?: string }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} name={lineName} stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  },
)
LineChartComponent.displayName = "LineChartComponent"

export default function AnalyticsPage() {
  const [selectedExhibition, setSelectedExhibition] = useState("all")
  const [dateRange, setDateRange] = useState("week")
  const [isLoading, setIsLoading] = useState(false)
  const [statsData, setStatsData] = useState({
    industryMeetingData: industryMeetingData,
    dailyMeetingData: dailyMeetingData,
    clientMeetingData: clientMeetingData,
    statusData: statusData,
    timeSlotData: timeSlotData,
    summary: {
      totalMeetings: 0,
      confirmationRate: 0,
      cancellationRate: 0
    }
  })

  // statsAPIからデータを取得
  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setIsLoading(true)

        // 選択された展示会と期間に基づいてパラメータを設定
        const params: any = {
          period: dateRange,
        }

        // 特定の展示会が選択されている場合
        if (selectedExhibition !== "all") {
          params.exhibitionId = selectedExhibition
        }

        // 統計データ取得
        const response = await statsAPI.getStats(params)

        // 取得したデータをステートに設定
        setStatsData({
          industryMeetingData: response.industryStats || industryMeetingData,
          dailyMeetingData: response.dailyStats || dailyMeetingData,
          clientMeetingData: response.clientStats || clientMeetingData,
          statusData: response.statusStats || statusData,
          timeSlotData: response.timeSlotStats || timeSlotData,
          summary: {
            totalMeetings: response.summary?.totalMeetings || 142,
            confirmationRate: response.summary?.confirmationRate || 65,
            cancellationRate: response.summary?.cancellationRate || 10
          }
        })
      } catch (error) {
        console.error("統計データの取得に失敗しました:", error)
        // エラー時はモックデータを使用
        setStatsData({
          industryMeetingData,
          dailyMeetingData,
          clientMeetingData,
          statusData,
          timeSlotData,
          summary: {
            totalMeetings: 142,
            confirmationRate: 65,
            cancellationRate: 10
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatsData()
  }, [selectedExhibition, dateRange])

  // フィルタリングされたデータをメモ化
  const filteredData = useMemo(() => {
    return statsData
  }, [statsData])

  // 4. タブコンテンツをメモ化
  const IndustryTabContent = memo(() => {
    const { industryMeetingData } = filteredData

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <PieChartComponent data={industryMeetingData} title="業種別商談数" description="業種ごとの商談数の分布" />
        <BarChartComponent
          data={industryMeetingData}
          title="業種別商談数（棒グラフ）"
          description="業種ごとの商談数の比較"
          layout="vertical"
        />
      </div>
    )
  })
  IndustryTabContent.displayName = "IndustryTabContent"

  // 5. 他のタブコンテンツも同様にメモ化
  // ...

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">データ分析</h1>
          <p className="text-muted-foreground mt-1">商談データの分析と可視化</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>フィルター</CardTitle>
              <CardDescription>表示するデータの範囲を選択</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exhibition">展示会</Label>
                  <Select value={selectedExhibition} onValueChange={setSelectedExhibition}>
                    <SelectTrigger id="exhibition">
                      <SelectValue placeholder="展示会を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {exhibitions.map((exhibition) => (
                        <SelectItem key={exhibition.id} value={exhibition.id}>
                          {exhibition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-range">期間</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="期間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">直近1週間</SelectItem>
                      <SelectItem value="month">直近1ヶ月</SelectItem>
                      <SelectItem value="quarter">直近3ヶ月</SelectItem>
                      <SelectItem value="all">すべての期間</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>概要</CardTitle>
              <CardDescription>
                {selectedExhibition === "all"
                  ? "すべての展示会"
                  : exhibitions.find((e) => e.id === selectedExhibition)?.name || ""}
                の商談データ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">総商談数</p>
                    <Skeleton className="h-8 w-16 mx-auto mt-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">確定率</p>
                    <Skeleton className="h-8 w-16 mx-auto mt-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">キャンセル率</p>
                    <Skeleton className="h-8 w-16 mx-auto mt-1" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">総商談数</p>
                    <p className="text-2xl font-bold">{statsData.summary.totalMeetings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">確定率</p>
                    <p className="text-2xl font-bold">{statsData.summary.confirmationRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">キャンセル率</p>
                    <p className="text-2xl font-bold">{statsData.summary.cancellationRate}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="industry" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="industry">業種別分析</TabsTrigger>
            <TabsTrigger value="daily">日付別推移</TabsTrigger>
            <TabsTrigger value="client">クライアント別</TabsTrigger>
            <TabsTrigger value="status">ステータス別</TabsTrigger>
          </TabsList>

          {/* 業種別分析タブ */}
          <TabsContent value="industry">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>業種別商談数</CardTitle>
                    <CardDescription>業種ごとの商談数の分布</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80 flex items-center justify-center">
                      <Skeleton className="h-64 w-64 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>業種別商談数（棒グラフ）</CardTitle>
                    <CardDescription>業種ごとの商談数の比較</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <IndustryTabContent />
            )}
          </TabsContent>

          {/* 日付別推移タブ */}
          <TabsContent value="daily">
            {isLoading ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>日付別商談数推移</CardTitle>
                    <CardDescription>日付ごとの商談数の変化</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>時間帯別商談数</CardTitle>
                    <CardDescription>時間帯ごとの商談数の分布</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>日付別商談数推移</CardTitle>
                    <CardDescription>日付ごとの商談数の変化</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={filteredData.dailyMeetingData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="count" name="商談数" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>時間帯別商談数</CardTitle>
                    <CardDescription>時間帯ごとの商談数の分布</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={filteredData.timeSlotData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" name="商談数" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* クライアント別タブ */}
          <TabsContent value="client">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <CardTitle>クライアント別商談数</CardTitle>
                  <CardDescription>クライアントごとの商談数の比較</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>クライアント別商談数</CardTitle>
                  <CardDescription>クライアントごとの商談数の比較</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredData.clientMeetingData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 150,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="商談数" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ステータス別タブ */}
          <TabsContent value="status">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>商談ステータス分布</CardTitle>
                    <CardDescription>商談のステータス別分布</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80 flex items-center justify-center">
                      <Skeleton className="h-64 w-64 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ステータス別詳細</CardTitle>
                    <CardDescription>商談ステータスの詳細情報</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Skeleton className="w-4 h-4 rounded-full mr-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center">
                            <Skeleton className="h-4 w-8 mr-2" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>商談ステータス分布</CardTitle>
                    <CardDescription>商談のステータス別分布</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={filteredData.statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {filteredData.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ステータス別詳細</CardTitle>
                    <CardDescription>商談ステータスの詳細情報</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredData.statusData.map((status) => (
                        <div key={status.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                            <span>{status.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold mr-2">{status.value}</span>
                            <span className="text-muted-foreground text-sm">
                              ({((status.value / filteredData.statusData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}
                              %)
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t mt-4">
                        <h4 className="font-medium mb-2">ステータス別アクション</h4>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <span className="font-medium">確定:</span> 予定通り進行中の商談
                          </li>
                          <li>
                            <span className="font-medium">未確定:</span> 確認待ちの商談（リマインダー送信推奨）
                          </li>
                          <li>
                            <span className="font-medium">キャンセル:</span> キャンセルされた商談（フォローアップ推奨）
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
