"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ClientLayout from "@/components/client-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarDays,
  Clock,
  Building,
  ArrowLeft,
  Edit,
  XCircle,
  FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { meetingAPI } from "@/lib/api"
import { formatDate, formatTime } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

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
  venueName?: string
  contactPerson?: string
  createdAt: string
  updatedAt: string
}

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { id } = params

  // 商談詳細情報を取得
  useEffect(() => {
    const fetchMeetingDetail = async () => {
      try {
        setIsLoading(true)
        const response = await meetingAPI.getById(id)
        setMeeting(response.meeting)
      } catch (error) {
        console.error("商談詳細の取得に失敗しました:", error)
        toast({
          title: "エラーが発生しました",
          description: "商談情報の取得に失敗しました。",
          variant: "destructive",
        })
        router.push("/client/meetings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetingDetail()
  }, [id, router, toast])

  // 商談ステータスに応じたバッジを表示
  const getStatusBadge = (status?: Meeting["status"]) => {
    if (!status) return null

    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">確定</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">保留中</Badge>
      case "canceled":
        return <Badge variant="destructive">キャンセル</Badge>
    }
  }

  // 商談キャンセル処理
  const handleCancelMeeting = async () => {
    if (!meeting) return

    try {
      setIsCanceling(true)
      await meetingAPI.cancel(meeting.id, cancelReason)

      toast({
        title: "商談をキャンセルしました",
        description: "商談予約がキャンセルされました。",
      })

      // ステータスを更新して表示を反映
      setMeeting({ ...meeting, status: "canceled" })
    } catch (error) {
      console.error("商談キャンセルに失敗しました:", error)
      toast({
        title: "エラーが発生しました",
        description: "商談のキャンセルに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.push("/client/meetings")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold">商談詳細</h1>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        ) : meeting ? (
          <>
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{meeting.exhibitionName}</CardTitle>
                    <CardDescription>商談ID: {meeting.id}</CardDescription>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">日時</h3>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span>{formatDate(meeting.date)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                      </div>
                    </div>

                    {meeting.venueName && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">会場</h3>
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          <span>{meeting.venueName}</span>
                        </div>
                      </div>
                    )}

                    {meeting.contactPerson && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">担当者</h3>
                        <span>{meeting.contactPerson}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">ステータス</h3>
                      <div className="flex items-center">
                        {meeting.status === "confirmed" && <span>確定済み</span>}
                        {meeting.status === "pending" && <span>確認待ち</span>}
                        {meeting.status === "canceled" && <span>キャンセル済み</span>}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">予約日時</h3>
                      <div>{new Date(meeting.createdAt).toLocaleString()}</div>
                    </div>

                    {meeting.createdAt !== meeting.updatedAt && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">最終更新</h3>
                        <div>{new Date(meeting.updatedAt).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">商談目的</h3>
                    <div className="bg-muted p-3 rounded-md">
                      {meeting.purpose || "商談目的が入力されていません"}
                    </div>
                  </div>

                  {meeting.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">備考</h3>
                      <div className="bg-muted p-3 rounded-md">
                        {meeting.notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 pt-4 border-t">
                {meeting.status !== "canceled" && (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={() => router.push(`/client/meetings/${meeting.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      編集
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="flex items-center"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          キャンセル
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>商談をキャンセルしますか？</AlertDialogTitle>
                          <AlertDialogDescription>
                            この操作は取り消せません。キャンセル理由を入力してください。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Textarea
                            placeholder="キャンセル理由"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>戻る</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelMeeting}
                            disabled={isCanceling}
                          >
                            {isCanceling ? "処理中..." : "キャンセルする"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      レポート
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>商談レポート</DialogTitle>
                      <DialogDescription>
                        商談の内容や結果を記録できます。（開発中の機能）
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>この機能は現在開発中です。</p>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary">
                        閉じる
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>追加情報</CardTitle>
                <CardDescription>
                  展示会の詳細情報やブース位置などの補足情報
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  追加情報は現在ありません。展示会の詳細については主催者にお問い合わせください。
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">商談情報が見つかりませんでした</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/client/meetings")}
              >
                商談一覧に戻る
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  )
}