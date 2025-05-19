"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, PlusCircle, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllClients, Client } from '@/lib/supabase/queries'
import { OptimizedDataTable } from "@/components/optimized-data-table"

// 展示会データの型定義
interface Exhibition {
  id: number
  name: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // クライアント一覧を取得
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const clients = await getAllClients()
        setClients(clients)
        setFilteredClients(clients)
      } catch (error) {
        console.error("クライアント取得エラー:", error)
        toast({
          title: "エラーが発生しました",
          description: "クライアント情報の取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [toast])

  // 検索機能
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(lowerCaseQuery) ||
          client.companyName.toLowerCase().includes(lowerCaseQuery) ||
          client.email.toLowerCase().includes(lowerCaseQuery)
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [searchQuery, clients])

  // クライアント詳細ページに移動
  const handleRowClick = (clientId: string) => {
    router.push(`/admin/clients/${clientId}`)
  }

  // テーブル列定義
  const columns = [
    {
      header: "企業名",
      accessorKey: "companyName",
    },
    {
      header: "担当者名",
      accessorKey: "name",
    },
    {
      header: "メールアドレス",
      accessorKey: "email",
    },
    {
      header: "電話番号",
      accessorKey: "phone",
    },
    {
      header: "登録日",
      accessorKey: "createdAt",
      cell: (info: any) => {
        const date = new Date(info.getValue())
        return date.toLocaleDateString("ja-JP")
      },
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">クライアント一覧</h1>
            <p className="text-muted-foreground mt-1">クライアントの登録・管理を行います</p>
          </div>
          <Link href="/admin/clients/new">
            <Button className="mt-4 sm:mt-0 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              新規クライアント登録
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>クライアント検索</CardTitle>
            <CardDescription>企業名や担当者名で検索できます</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="企業名、担当者名で検索..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <OptimizedDataTable
          columns={columns}
          data={filteredClients}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          noDataMessage="クライアントが見つかりませんでした"
        />
      </div>
    </AdminLayout>
  )
}
