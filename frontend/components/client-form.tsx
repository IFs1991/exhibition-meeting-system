"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// 展示会データの型定義
export interface Exhibition {
  id: number
  name: string
}

// クライアントデータの型定義
export interface ClientFormData {
  id?: number
  companyName: string
  contactPerson: string
  email: string
  industry: string
  phone: string
  website: string
  address: string
  status: "active" | "inactive"
  exhibitions: number[]
  notes: string
}

interface ClientFormProps {
  initialData?: Partial<ClientFormData>
  exhibitions: Exhibition[]
  onSubmit: (data: ClientFormData) => Promise<void>
  submitButtonText?: string
  isEdit?: boolean
}

// 業種の選択肢
const industries = [
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
]

// デフォルト値
const defaultFormData: ClientFormData = {
  companyName: "",
  contactPerson: "",
  email: "",
  industry: "IT・通信",
  phone: "",
  website: "",
  address: "",
  status: "active",
  exhibitions: [],
  notes: "",
}

export function ClientForm({
  initialData = {},
  exhibitions,
  onSubmit,
  submitButtonText = "保存",
  isEdit = false,
}: ClientFormProps) {
  // フォームデータの状態
  const [formData, setFormData] = useState<ClientFormData>({ ...defaultFormData, ...initialData })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // 初期データが変更された場合にフォームデータを更新
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData({ ...defaultFormData, ...initialData })
      setHasChanges(false)
    }
  }, [initialData])

  // フォームフィールドの更新
  const updateField = useCallback(
    <K extends keyof ClientFormData>(field: K, value: ClientFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setHasChanges(true)

      // エラーをクリア
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [errors],
  )

  // 展示会の選択状態を切り替える
  const toggleExhibition = useCallback(
    (exhibitionId: number) => {
      setFormData((prev) => {
        const newExhibitions = prev.exhibitions.includes(exhibitionId)
          ? prev.exhibitions.filter((id) => id !== exhibitionId)
          : [...prev.exhibitions, exhibitionId]

        return { ...prev, exhibitions: newExhibitions }
      })
      setHasChanges(true)

      // 展示会が選択された場合、エラーをクリア
      if (errors.exhibitions) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.exhibitions
          return newErrors
        })
      }
    },
    [errors],
  )

  // フォームの検証
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = "会社名は必須です"
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "担当者名は必須です"
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスは必須です"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください"
    }

    if (!formData.industry) {
      newErrors.industry = "業種は必須です"
    }

    if (formData.exhibitions.length === 0) {
      newErrors.exhibitions = "少なくとも1つの展示会を選択してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      await onSubmit(formData)
      setHasChanges(false)
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "エラーが発生しました",
        description: "保存に失敗しました。再度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "クライアント情報編集" : "新規クライアント登録"}</CardTitle>
          <CardDescription>
            {isEdit ? "クライアント情報を編集します" : "新しいクライアントの情報を入力してください"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">基本情報</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name" className={errors.companyName ? "text-destructive" : ""}>
                  会社名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company-name"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="例: 株式会社サンプル"
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className={errors.industry ? "text-destructive" : ""}>
                  業種 <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.industry} onValueChange={(value) => updateField("industry", value)}>
                  <SelectTrigger id="industry" className={errors.industry ? "border-destructive" : ""}>
                    <SelectValue placeholder="業種を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
              </div>
            </div>
          </div>

          {/* 連絡先情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">連絡先情報</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-person" className={errors.contactPerson ? "text-destructive" : ""}>
                  担当者名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-person"
                  value={formData.contactPerson}
                  onChange={(e) => updateField("contactPerson", e.target.value)}
                  placeholder="例: 山田太郎"
                  className={errors.contactPerson ? "border-destructive" : ""}
                />
                {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  メールアドレス <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="例: yamada@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="例: 03-1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Webサイト</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="例: https://example.com"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="例: 東京都渋谷区〇〇町1-2-3"
              />
            </div>
          </div>

          {/* 展示会選択 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">参加展示会</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status" className="text-sm">
                  アカウント状態:
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => updateField("status", value)}
                >
                  <SelectTrigger id="status" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="inactive">無効</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {errors.exhibitions && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.exhibitions}</AlertDescription>
              </Alert>
            )}

            <div className="border rounded-md p-4 space-y-2">
              {exhibitions.length > 0 ? (
                exhibitions.map((exhibition) => (
                  <div key={exhibition.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exhibition-${exhibition.id}`}
                      checked={formData.exhibitions.includes(exhibition.id)}
                      onCheckedChange={() => toggleExhibition(exhibition.id)}
                    />
                    <Label htmlFor={`exhibition-${exhibition.id}`} className="text-sm font-normal cursor-pointer">
                      {exhibition.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">利用可能な展示会がありません</p>
              )}
            </div>
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label htmlFor="notes">備考</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="クライアントに関する補足情報があれば入力してください"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting || !hasChanges}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
