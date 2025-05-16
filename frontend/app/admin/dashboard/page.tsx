import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { memo } from "react"

// 2. 統計カードをコンポーネント化
const StatCard = memo(({ stat }: { stat: { name: string; value: string; icon: any; href: string } }) => {
  return (
    <Card key={stat.name}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <Link href={stat.href} className="text-xs text-muted-foreground hover:underline">
          詳細を見る
        </Link>
      </CardContent>
    </Card>
  )
})
StatCard.displayName = "StatCard"

// 3. 展示会テーブルをコンポーネント化
const ExhibitionTable = memo(({ exhibitions }: { exhibitions: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-sm">
            <th className="pb-2 text-left font-medium">展示会名</th>
            <th className="pb-2 text-left font-medium">開催期間</th>
            <th className="pb-2 text-right font-medium">クライアント数</th>
            <th className="pb-2 text-right font-medium">商談数</th>
          </tr>
        </thead>
        <tbody>
          {exhibitions.map((exhibition) => (
            <tr key={exhibition.id} className="border-b">
              <td className="py-3">
                <Link href={`/admin/exhibitions/${exhibition.id}`} className="hover:underline">
                  {exhibition.name}
                </Link>
              </td>
              <td className="py-3">{exhibition.period}</td>
              <td className="py-3 text-right">{exhibition.clientCount}</td>
              <td className="py-3 text-right">{exhibition.meetingCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
ExhibitionTable.displayName = "ExhibitionTable"

// 4. クライアントテーブルをコンポーネント化
const ClientTable = memo(({ clients }: { clients: any[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-sm">
            <th className="pb-2 text-left font-medium">企業名</th>
            <th className="pb-2 text-left font-medium">業種</th>
            <th className="pb-2 text-right font-medium">商談数</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b">
              <td className="py-3">
                <Link href={`/admin/clients/${client.id}`} className="hover:underline">
                  {client.name}
                </Link>
              </td>
              <td className="py-3">{client.industry}</td>
              <td className="py-3 text-right">{client.meetingCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
ClientTable.displayName = "ClientTable"

export default function AdminDashboard() {
  // 実際の実装ではAPIからデータを取得
  const stats = [
    { name: "管理中の展示会", value: "5", icon: Calendar, href: "/admin/exhibitions" },
    { name: "登録クライアント数", value: "24", icon: Building2, href: "/admin/clients" },
    { name: "総商談数", value: "142", icon: Users, href: "/admin/analytics" },
  ]

  // 最近の展示会データ（実際の実装ではAPIから取得）
  const recentExhibitions = [
    { id: 1, name: "東京ビジネスエキスポ2023", period: "2023/10/15 - 2023/10/17", clientCount: 8, meetingCount: 42 },
    { id: 2, name: "大阪産業フェア2023", period: "2023/11/05 - 2023/11/07", clientCount: 6, meetingCount: 35 },
    {
      id: 3,
      name: "名古屋テクノロジーショー2023",
      period: "2023/12/01 - 2023/12/03",
      clientCount: 5,
      meetingCount: 28,
    },
  ]

  // 最近のクライアントデータ（実際の実装ではAPIから取得）
  const recentClients = [
    { id: 1, name: "株式会社テクノソリューション", industry: "IT・通信", meetingCount: 12 },
    { id: 2, name: "グローバル商事株式会社", industry: "商社", meetingCount: 8 },
    { id: 3, name: "未来工業株式会社", industry: "製造", meetingCount: 15 },
    { id: 4, name: "エコシステム株式会社", industry: "環境・エネルギー", meetingCount: 7 },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">管理者ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">展示会と商談の管理状況を確認できます</p>
        </div>

        {/* 統計カード */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.name} stat={stat} />
          ))}
        </div>

        {/* 最近の展示会 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>最近の展示会</CardTitle>
              <Link href="/admin/exhibitions">
                <Button variant="ghost" size="sm">
                  すべて表示
                </Button>
              </Link>
            </div>
            <CardDescription>管理中の展示会一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <ExhibitionTable exhibitions={recentExhibitions} />
          </CardContent>
        </Card>

        {/* 最近のクライアント */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>最近のクライアント</CardTitle>
              <Link href="/admin/clients">
                <Button variant="ghost" size="sm">
                  すべて表示
                </Button>
              </Link>
            </div>
            <CardDescription>登録されているクライアント一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientTable clients={recentClients} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
