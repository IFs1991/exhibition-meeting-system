"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Building2, Calendar, ChevronDown, LogOut, Menu, PlusCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useCompany } from "@/contexts/company-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from '@/contexts/auth-context'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  // CompanyContextから会社情報と展示会情報を取得
  const { companyInfo, activeExhibition, isLoading } = useCompany()

  const { user, logout, isLoading: authLoading } = useAuth()

  const navigation = useMemo(
    () => [
      {
        name: "ダッシュボード",
        href: "/client/dashboard",
        icon: BarChart3,
        current: pathname === "/client/dashboard",
      },
      {
        name: "商談予約作成",
        href: "/client/meetings/new",
        icon: PlusCircle,
        current: pathname === "/client/meetings/new",
      },
      {
        name: "商談一覧",
        href: "/client/meetings",
        icon: Calendar,
        current:
          pathname === "/client/meetings" ||
          (pathname.startsWith("/client/meetings/") && pathname !== "/client/meetings/new"),
      },
      {
        name: "自社情報設定",
        href: "/client/settings",
        icon: Building2,
        current: pathname === "/client/settings",
      },
    ],
    [pathname],
  )

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: 'ログアウトしました',
        description: 'またのご利用をお待ちしております',
      })
      router.push('/login')
    } catch (error) {
      toast({
        title: 'ログアウトエラー',
        description: error instanceof Error ? error.message : 'ログアウトに失敗しました',
        variant: 'destructive',
      })
    }
  }

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  const Sidebar = useCallback(
    () => (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r h-full">
        <div className="flex h-16 shrink-0 items-center px-6 border-b">
          <Link href="/client/dashboard" className="text-xl font-semibold">
            展示会商談予約システム
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7 px-6">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        item.current
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                      )}
                    >
                      <item.icon
                        className={cn(
                          item.current ? "text-slate-900" : "text-slate-400 group-hover:text-slate-900",
                          "h-5 w-5 shrink-0 transition-colors",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    ),
    [navigation],
  )

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* モバイル用サイドバー */}
      {isMobile && (
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* デスクトップ用サイドバー */}
      {!isMobile && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>
      )}

      <div className="flex flex-1 flex-col lg:pl-72">
        {/* ヘッダー */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {isMobile && (
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="サイドバーを開く"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-2"
                      onClick={() => router.push("/client/settings")}
                    >
                      <User className="h-5 w-5" />
                      <span>{companyInfo.companyName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <p className="text-muted-foreground mt-1">
                      {companyInfo.companyName} - {activeExhibition?.name || "展示会未選択"}
                    </p>
                  </>
                )}
              </div>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="ログアウト">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
