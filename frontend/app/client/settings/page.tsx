"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimePickerInput } from "@/components/time-picker-input"
import { useToast, handleApiError } from "@/hooks/use-toast"
import { Loader2, Save, Trash2, User, Calendar, Check, Plus, AlertCircle } from "lucide-react"
import { useCompany, type Exhibition } from "@/contexts/company-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from '@/contexts/auth-context'
import { authAPI } from "@/lib/api"

// 担当者の型定義
interface StaffMember {
  id: string
  name: string
  email: string
  position: string
  priority: number
  isAvailable: boolean
}

// 商談時間設定の型定義
interface MeetingTimeSettings {
  duration: number // 分単位
  startTime: string // HH:MM形式
  endTime: string // HH:MM形式
  breakStartTime: string // HH:MM形式
  breakEndTime: string // HH:MM形式
  hasBreakTime: boolean
}

export default function CompanySettings() {
  // CompanyContextから会社情報と更新関数を取得
  const { companyInfo, updateCompanyInfo, updateExhibition, addExhibition, removeExhibition, isLoading } = useCompany()
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)

  // 基本情報の状態
  const [companyName, setCompanyName] = useState(companyInfo.companyName)
  const [industry, setIndustry] = useState(companyInfo.industry)
  const [address, setAddress] = useState(companyInfo.address)
  const [phone, setPhone] = useState(companyInfo.phone)
  const [website, setWebsite] = useState(companyInfo.website)
  const [description, setDescription] = useState(companyInfo.description)

  // 展示会の状態
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(companyInfo.exhibitions)

  // エラー状態
  const [errors, setErrors] = useState<{
    companyName?: string
    exhibitions?: string
  }>({})

  // 変更があったかどうかを追跡
  const [hasChanges, setHasChanges] = useState(false)

  // プロファイル情報を取得
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileLoading(true)

        // APIを使用したデータ取得と、Supabaseクエリを使用したデータ取得の両方を実装
        // 1. バックエンドAPI経由でプロファイル情報を取得
        const apiData = await authAPI.getProfile().catch(() => null)

        // 2. Supabaseから直接データ取得（RLSで保護）
        const { getMyProfile } = await import('@/lib/supabase/queries')
        const supabaseData = await getMyProfile().catch(() => null)

        // データを統合（APIデータを優先）
        const profileInfo = apiData?.user || supabaseData

        if (profileInfo) {
          setProfileData(profileInfo)

          // プロファイル情報が会社情報を含む場合は設定
          if (profileInfo.companyName) setCompanyName(profileInfo.companyName)
          if (profileInfo.address) setAddress(profileInfo.address)
          if (profileInfo.phoneNumber) setPhone(profileInfo.phoneNumber)
        }
      } catch (error) {
        console.error('プロファイル情報の取得に失敗しました', error)
        toast({
          title: 'エラー',
          description: 'プロファイル情報の取得に失敗しました',
          variant: 'destructive',
        })
      } finally {
        setProfileLoading(false)
      }
    }

    if (user) {
      fetchProfileData()
    }
  }, [user, toast])

  // CompanyContextが更新されたら、ローカルの状態も更新
  useEffect(() => {
    if (!isLoading) {
      setCompanyName(companyInfo.companyName)
      setIndustry(companyInfo.industry)
      setAddress(companyInfo.address)
      setPhone(companyInfo.phone)
      setWebsite(companyInfo.website)
      setDescription(companyInfo.description)
      setExhibitions(companyInfo.exhibitions)
      setHasChanges(false)
    }
  }, [companyInfo, isLoading])

  // 担当者の状態
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "山田太郎",
      email: "yamada@example.com",
      position: "営業部長",
      priority: 90,
      isAvailable: true,
    },
    {
      id: "2",
      name: "佐藤花子",
      email: "sato@example.com",
      position: "営業担当",
      priority: 70,
      isAvailable: true,
    },
  ])

  // 商談時間設定の状態
  const [timeSettings, setTimeSettings] = useState<MeetingTimeSettings>({
    duration: 30, // デフォルト30分
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "12:00",
    breakEndTime: "13:00",
    hasBreakTime: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 業種の選択肢
  const industries = useMemo(
    () => [
      "IT・通信",
      "製造",
      "商社",
      "金融・保険",
      "建設・不動産",
      "医療・ヘルスケア",
      "教育",
      "小売・流通",
      "サービス",
      "環境・エネルギー",
      "その他",
    ],
    [],
  )

  // 担当者を追加
  const handleAddStaffMember = useCallback(() => {
    if (staffMembers.length >= 10) {
      toast({
        title: "上限に達しました",
        description: "担当者は最大10人まで登録できます",
        variant: "destructive",
      })
      return
    }

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: "",
      email: "",
      position: "",
      priority: 50,
      isAvailable: true,
    }

    setStaffMembers((prev) => [...prev, newStaff])
    setHasChanges(true)
  }, [staffMembers.length, toast])

  // 担当者を削除
  const handleRemoveStaffMember = useCallback((id: string) => {
    setStaffMembers((prev) => prev.filter((staff) => staff.id !== id))
    setHasChanges(true)
  }, [])

  // 担当者情報を更新
  const handleUpdateStaffMember = useCallback((id: string, field: keyof StaffMember, value: any) => {
    setStaffMembers((prev) =>
      prev.map((staff) => {
        if (staff.id === id) {
          return { ...staff, [field]: value }
        }
        return staff
      }),
    )
    setHasChanges(true)
  }, [])

  // 展示会を追加
  const handleAddExhibition = useCallback(() => {
    const newExhibition: Exhibition = {
      id: Date.now().toString(),
      name: "",
      period: "",
      location: "",
      isActive: false,
    }
    setExhibitions((prev) => [...prev, newExhibition])
    addExhibition(newExhibition)
    setHasChanges(true)

    // エラーをクリア
    setErrors((prev) => ({ ...prev, exhibitions: undefined }))
  }, [addExhibition])

  // 展示会を削除
  const handleRemoveExhibition = useCallback(
    (id: string) => {
      setExhibitions((prev) => prev.filter((exhibition) => exhibition.id !== id))
      removeExhibition(id)
      setHasChanges(true)
    },
    [removeExhibition],
  )

  // 展示会情報を更新
  const handleUpdateExhibition = useCallback(
    (id: string, field: keyof Exhibition, value: any) => {
      // 有効フラグが変更された場合、他の展示会の有効フラグをオフにする
      if (field === "isActive" && value === true) {
        const updatedExhibitions = exhibitions.map((exhibition) => ({
          ...exhibition,
          isActive: exhibition.id === id,
        }))

        setExhibitions(updatedExhibitions)

        // 各展示会を個別に更新
        updatedExhibitions.forEach((exhibition) => {
          updateExhibition(exhibition.id, "isActive", exhibition.isActive)
        })
      } else {
        // 通常の更新
        setExhibitions((prev) =>
          prev.map((exhibition) => {
            if (exhibition.id === id) {
              return { ...exhibition, [field]: value }
            }
            return exhibition
          }),
        )
        updateExhibition(id, field, value)
      }

      setHasChanges(true)

      // 名前が入力された場合、エラーをクリア
      if (field === "name" && value.trim() !== "") {
        setErrors((prev) => ({ ...prev, exhibitions: undefined }))
      }
    },
    [exhibitions, updateExhibition],
  )

  // 商談時間設定を更新
  const updateTimeSettings = useCallback((field: keyof MeetingTimeSettings, value: any) => {
    setTimeSettings((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }, [])

  // 入力検証
  const validateForm = useCallback(() => {
    const newErrors: {
      companyName?: string;
      exhibitions?: string;
    } = {};

    if (!companyName.trim()) {
      newErrors.companyName = "会社名は必須です";
    }

    const hasValidExhibition = exhibitions.some(
      (exhibition) => exhibition.name.trim() && exhibition.period.trim()
    );
    if (exhibitions.length > 0 && !hasValidExhibition) {
      newErrors.exhibitions = "展示会情報を正しく入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [companyName, exhibitions]);

  // 送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 入力検証
    if (!validateForm()) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 会社情報の更新
      await updateCompanyInfo({
        companyName,
        industry,
        address,
        phone,
        website,
        description,
      })

      // プロファイル情報の更新（Supabase Auth経由）
      if (profileData) {
        // updateProfileの型に合わせて必要なデータだけを渡す
        await updateProfile({
          fullName: profileData.fullName || ''
        })

        // プロファイル情報の更新はAPIを通して行う
        await authAPI.updateProfile({
          fullName: profileData.fullName,
          companyName,
          phoneNumber: phone,
          address,
        })
      }

      toast({
        title: "設定を保存しました",
        description: "会社情報とプロファイルが更新されました",
      })

      setHasChanges(false)
    } catch (error) {
      console.error('設定の保存に失敗しました', error)
      handleApiError(error, toast)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="staff">担当者設定</TabsTrigger>
            <TabsTrigger value="time">商談時間設定</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">自社情報設定</h1>
        <p className="text-muted-foreground mt-1">自社情報と商談予約の設定を行います</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="staff">担当者設定</TabsTrigger>
            <TabsTrigger value="time">商談時間設定</TabsTrigger>
          </TabsList>

          {/* 基本情報タブ */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardDescription>自社の基本情報を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className={errors.companyName ? "text-destructive" : ""}>
                      会社名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value)
                        setHasChanges(true)
                        if (e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, companyName: undefined }))
                        }
                      }}
                      required
                      className={errors.companyName ? "border-destructive" : ""}
                      aria-invalid={errors.companyName ? "true" : "false"}
                    />
                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">
                      業種 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={industry}
                      onValueChange={(value) => {
                        setIndustry(value)
                        setHasChanges(true)
                      }}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="業種を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">住所</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      setHasChanges(true)
                    }}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Webサイト</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => {
                        setWebsite(e.target.value)
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">会社概要</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      setHasChanges(true)
                    }}
                    rows={4}
                  />
                </div>
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">参加展示会</h3>
                    <Button
                      type="button"
                      onClick={handleAddExhibition}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      展示会を追加
                    </Button>
                  </div>

                  {errors.exhibitions && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>エラー</AlertTitle>
                      <AlertDescription>{errors.exhibitions}</AlertDescription>
                    </Alert>
                  )}

                  {exhibitions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      参加展示会が登録されていません。「展示会を追加」ボタンから登録してください。
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {exhibitions.map((exhibition) => (
                        <div key={exhibition.id} className="rounded-lg border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                              <h4 className="font-medium">展示会情報</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`exhibition-active-${exhibition.id}`}
                                  checked={exhibition.isActive}
                                  onCheckedChange={(checked) =>
                                    handleUpdateExhibition(exhibition.id, "isActive", checked)
                                  }
                                />
                                <Label htmlFor={`exhibition-active-${exhibition.id}`} className="text-sm">
                                  有効
                                </Label>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveExhibition(exhibition.id)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`exhibition-name-${exhibition.id}`}>
                              展示会名 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`exhibition-name-${exhibition.id}`}
                              value={exhibition.name}
                              onChange={(e) => handleUpdateExhibition(exhibition.id, "name", e.target.value)}
                              placeholder="例: 東京ビジネスエキスポ2023"
                              required
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`exhibition-period-${exhibition.id}`}>開催期間</Label>
                              <Input
                                id={`exhibition-period-${exhibition.id}`}
                                value={exhibition.period}
                                onChange={(e) => handleUpdateExhibition(exhibition.id, "period", e.target.value)}
                                placeholder="例: 2023/10/15 - 2023/10/17"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`exhibition-location-${exhibition.id}`}>開催場所</Label>
                              <Input
                                id={`exhibition-location-${exhibition.id}`}
                                value={exhibition.location}
                                onChange={(e) => handleUpdateExhibition(exhibition.id, "location", e.target.value)}
                                placeholder="例: 東京ビッグサイト"
                              />
                            </div>
                          </div>

                          {exhibition.isActive && (
                            <div className="mt-2 text-sm text-green-600 font-medium flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              現在アクティブな展示会
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 担当者設定タブ */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>担当者設定</CardTitle>
                <CardDescription>
                  商談予約の担当者と優先度を設定します。優先度の高い担当者から順に商談が割り当てられます。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleAddStaffMember}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={staffMembers.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                    担当者を追加
                  </Button>
                </div>

                {staffMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    担当者が登録されていません。「担当者を追加」ボタンから登録してください。
                  </div>
                ) : (
                  <div className="space-y-6">
                    {staffMembers.map((staff, index) => (
                      <div key={staff.id} className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-muted-foreground mr-2" />
                            <h3 className="font-medium">担当者 {index + 1}</h3>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveStaffMember(staff.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`staff-name-${staff.id}`}>
                              氏名 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`staff-name-${staff.id}`}
                              value={staff.name}
                              onChange={(e) => handleUpdateStaffMember(staff.id, "name", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`staff-email-${staff.id}`}>
                              メールアドレス <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`staff-email-${staff.id}`}
                              type="email"
                              value={staff.email}
                              onChange={(e) => handleUpdateStaffMember(staff.id, "email", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`staff-position-${staff.id}`}>役職・部署</Label>
                          <Input
                            id={`staff-position-${staff.id}`}
                            value={staff.position}
                            onChange={(e) => handleUpdateStaffMember(staff.id, "position", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`staff-priority-${staff.id}`}>優先度 ({staff.priority})</Label>
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`staff-available-${staff.id}`} className="text-sm">
                                有効
                              </Label>
                              <Switch
                                id={`staff-available-${staff.id}`}
                                checked={staff.isAvailable}
                                onCheckedChange={(checked) =>
                                  handleUpdateStaffMember(staff.id, "isAvailable", checked)
                                }
                              />
                            </div>
                          </div>
                          <Slider
                            id={`staff-priority-${staff.id}`}
                            min={0}
                            max={100}
                            step={1}
                            value={[staff.priority]}
                            onValueChange={(value) => handleUpdateStaffMember(staff.id, "priority", value[0])}
                            disabled={!staff.isAvailable}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>低</span>
                            <span>高</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商談時間設定タブ */}
          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>商談時間設定</CardTitle>
                <CardDescription>商談の時間枠と営業時間を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meeting-duration">1回あたりの商談時間（分）</Label>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={timeSettings.duration.toString()}
                      onValueChange={(value) => updateTimeSettings("duration", Number.parseInt(value))}
                    >
                      <SelectTrigger id="meeting-duration" className="w-[180px]">
                        <SelectValue placeholder="商談時間を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15分</SelectItem>
                        <SelectItem value="30">30分</SelectItem>
                        <SelectItem value="45">45分</SelectItem>
                        <SelectItem value="60">60分</SelectItem>
                        <SelectItem value="90">90分</SelectItem>
                        <SelectItem value="120">120分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="business-start-time">営業開始時間</Label>
                    <TimePickerInput
                      id="business-start-time"
                      value={timeSettings.startTime}
                      onChange={(value) => updateTimeSettings("startTime", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-end-time">営業終了時間</Label>
                    <TimePickerInput
                      id="business-end-time"
                      value={timeSettings.endTime}
                      onChange={(value) => updateTimeSettings("endTime", value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="has-break-time"
                      checked={timeSettings.hasBreakTime}
                      onCheckedChange={(checked) => updateTimeSettings("hasBreakTime", checked)}
                    />
                    <Label htmlFor="has-break-time">休憩時間を設定する</Label>
                  </div>

                  {timeSettings.hasBreakTime && (
                    <div className="grid gap-4 sm:grid-cols-2 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="break-start-time">休憩開始時間</Label>
                        <TimePickerInput
                          id="break-start-time"
                          value={timeSettings.breakStartTime}
                          onChange={(value) => updateTimeSettings("breakStartTime", value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="break-end-time">休憩終了時間</Label>
                        <TimePickerInput
                          id="break-end-time"
                          value={timeSettings.breakEndTime}
                          onChange={(value) => updateTimeSettings("breakEndTime", value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  設定を保存
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}
