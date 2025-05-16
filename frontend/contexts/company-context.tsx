"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

// 展示会データの型定義
export interface Exhibition {
  id: string
  name: string
  period: string
  location: string
  isActive: boolean
}

// 会社情報の型定義
export interface CompanyInfo {
  companyName: string
  industry: string
  address: string
  phone: string
  website: string
  description: string
  exhibitions: Exhibition[]
}

// Contextの型定義
interface CompanyContextType {
  companyInfo: CompanyInfo
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void
  updateExhibition: (id: string, field: keyof Exhibition, value: any) => void
  addExhibition: (exhibition: Exhibition) => void
  removeExhibition: (id: string) => void
  activeExhibition: Exhibition | null
  isLoading: boolean
}

// デフォルト値
const defaultCompanyInfo: CompanyInfo = {
  companyName: "株式会社サンプル",
  industry: "IT・通信",
  address: "東京都渋谷区〇〇町1-2-3",
  phone: "03-1234-5678",
  website: "https://example.com",
  description: "当社は最先端のITソリューションを提供する企業です。",
  exhibitions: [
    {
      id: "1",
      name: "東京ビジネスエキスポ2023",
      period: "2023/10/15 - 2023/10/17",
      location: "東京ビッグサイト",
      isActive: true,
    },
    {
      id: "2",
      name: "大阪産業フェア2023",
      period: "2023/11/05 - 2023/11/07",
      location: "インテックス大阪",
      isActive: false,
    },
  ],
}

// Context作成
const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

// LocalStorageのキー
const STORAGE_KEY = "exhibition-system-company-info"

// Provider Component
export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo)
  const [isLoading, setIsLoading] = useState(true)

  // 会社情報を更新
  const updateCompanyInfo = useCallback((info: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => ({ ...prev, ...info }))
  }, [])

  // 展示会情報を更新
  const updateExhibition = useCallback((id: string, field: keyof Exhibition, value: any) => {
    setCompanyInfo((prev) => {
      // 有効フラグが変更された場合、他の展示会の有効フラグをオフにする
      if (field === "isActive" && value === true) {
        return {
          ...prev,
          exhibitions: prev.exhibitions.map((exhibition) => ({
            ...exhibition,
            isActive: exhibition.id === id,
          })),
        }
      }

      // 通常の更新
      return {
        ...prev,
        exhibitions: prev.exhibitions.map((exhibition) => {
          if (exhibition.id === id) {
            return { ...exhibition, [field]: value }
          }
          return exhibition
        }),
      }
    })
  }, [])

  // 展示会を追加
  const addExhibition = useCallback((exhibition: Exhibition) => {
    setCompanyInfo((prev) => ({
      ...prev,
      exhibitions: [...prev.exhibitions, exhibition],
    }))
  }, [])

  // 展示会を削除
  const removeExhibition = useCallback((id: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      exhibitions: prev.exhibitions.filter((exhibition) => exhibition.id !== id),
    }))
  }, [])

  // アクティブな展示会を計算
  const activeExhibition = useMemo(() => {
    return companyInfo.exhibitions.find((exhibition) => exhibition.isActive) || null
  }, [companyInfo.exhibitions])

  // ローカルストレージからデータを読み込む（実際の実装ではAPIから取得）
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const savedInfo = localStorage.getItem(STORAGE_KEY)

        if (savedInfo) {
          const parsedInfo = JSON.parse(savedInfo)
          setCompanyInfo(parsedInfo)
        }
      } catch (error) {
        console.error("Failed to load company info from localStorage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // データをローカルストレージに保存（実際の実装ではAPIに送信）
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(companyInfo))
      } catch (error) {
        console.error("Failed to save company info to localStorage", error)
      }
    }
  }, [companyInfo, isLoading])

  // コンテキスト値をメモ化
  const contextValue = useMemo(
    () => ({
      companyInfo,
      updateCompanyInfo,
      updateExhibition,
      addExhibition,
      removeExhibition,
      activeExhibition,
      isLoading,
    }),
    [companyInfo, updateCompanyInfo, updateExhibition, addExhibition, removeExhibition, activeExhibition, isLoading],
  )

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>
}

// Custom Hook
export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider")
  }
  return context
}
