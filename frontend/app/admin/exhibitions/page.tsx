"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Loader2, PlusCircle, Search, SortAsc, SortDesc } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast, handleApiError } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAllExhibitions, Exhibition } from '@/lib/supabase/queries'
import { exhibitionAPI } from '@/lib/api'
import { OptimizedDataTable } from "@/components/optimized-data-table"
import { formatDate } from "@/lib/utils"

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [filteredExhibitions, setFilteredExhibitions] = useState<Exhibition[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // 展示会一覧を取得
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true)

        // データソースを両方試す
        let exhibitionData: Exhibition[] = [];

        try {
          // 1. まずSupabaseから直接取得を試みる (RLSで保護)
          exhibitionData = await getAllExhibitions();
          console.log('Supabaseから取得した展示会データ:', exhibitionData.length);
        } catch (supabaseError) {
          console.warn('Supabaseからの取得に失敗、APIにフォールバック:', supabaseError);

          // 2. Supabaseからの取得に失敗した場合、バックエンドAPIから取得
          const apiResponse = await exhibitionAPI.getAll();
          exhibitionData = apiResponse.exhibitions as unknown as Exhibition[];
          console.log('APIから取得した展示会データ:', exhibitionData.length);
        }

        setExhibitions(exhibitionData);
        setFilteredExhibitions(exhibitionData);
      } catch (error) {
        console.error("展示会取得エラー:", error);
        handleApiError(error, toast);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibitions();
  }, [toast]);

  // 検索とフィルタリング
  useEffect(() => {
    let filtered = [...exhibitions]

    // ステータスフィルタリング
    if (statusFilter !== "all") {
      filtered = filtered.filter(exhibition => exhibition.status === statusFilter)
    }

    // テキスト検索
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        exhibition =>
          exhibition.name.toLowerCase().includes(lowerCaseQuery) ||
          (exhibition.venue?.toLowerCase() || '').includes(lowerCaseQuery) ||
          (exhibition.organizerName?.toLowerCase() || '').includes(lowerCaseQuery)
      )
    }

    setFilteredExhibitions(filtered)
  }, [searchQuery, statusFilter, exhibitions])

  // 展示会詳細ページに移動
  const handleRowClick = (exhibitionId: string) => {
    router.push(`/admin/exhibitions/${exhibitionId}`)
  }

  // 展示会ステータスに応じたバッジを表示
  const getStatusBadge = (status: Exhibition["status"]) => {
    switch (status) {
      case "planning":
        return <Badge className="bg-blue-100 text-blue-800">計画中</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800">開催中</Badge>
      case "completed":
        return <Badge variant="outline">終了</Badge>
      case "canceled":
        return <Badge variant="destructive">中止</Badge>
    }
  }

  // テーブル列定義
  const columns = [
    {
      header: "展示会名",
      accessorKey: "name",
    },
    {
      header: "会場",
      accessorKey: "venue",
      cell: (info: any) => info.getValue() || '',
    },
    {
      header: "開催期間",
      accessorKey: "startDate",
      cell: (info: any) => {
        const exhibition = info.row.original
        return `${formatDate(exhibition.startDate)} - ${formatDate(exhibition.endDate)}`
      },
    },
    {
      header: "参加者数",
      accessorKey: "currentAttendees",
      cell: (info: any) => {
        const exhibition = info.row.original
        return `${exhibition.currentAttendees} / ${exhibition.maxAttendees}`
      },
    },
    {
      header: "ステータス",
      accessorKey: "status",
      cell: (info: any) => getStatusBadge(info.getValue()),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">展示会管理</h1>
            <p className="text-muted-foreground mt-1">展示会の登録・管理を行います</p>
          </div>
          <Link href="/admin/exhibitions/new">
            <Button className="mt-4 sm:mt-0 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              新規展示会登録
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>展示会検索・フィルター</CardTitle>
            <CardDescription>展示会名や会場で検索、ステータスでフィルタリングできます</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="展示会名、会場、主催者名で検索..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのステータス</SelectItem>
                  <SelectItem value="planning">計画中</SelectItem>
                  <SelectItem value="active">開催中</SelectItem>
                  <SelectItem value="completed">終了</SelectItem>
                  <SelectItem value="canceled">中止</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <OptimizedDataTable
          columns={columns}
          data={filteredExhibitions}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          noDataMessage="展示会が見つかりませんでした"
        />
      </div>
    </AdminLayout>
  )
}
