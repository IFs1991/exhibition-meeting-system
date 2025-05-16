"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Building2, Calendar, ChevronDown, LogOut, Menu, PanelLeft, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  // AdminLayout.tsx を最適化

  // 1. ナビゲーション項目をメモ化して不要な再計算を防止
  const navigation = useMemo(
    () => [
      {
        name: "ダッシュボード",
        href: "/admin/dashboard",
        icon: BarChart3,
        current: pathname === "/admin/dashboard",
      },
      {
        name: "展示会管理",
        href: "/admin/exhibitions",
        icon: Calendar,
        current: pathname.startsWith("/admin/exhibitions"),
      },
      {
        name: "クライアント管理",
        href: "/admin/clients",
        icon: Building2,
        current: pathname.startsWith("/admin/clients"),
      },
      {
        name: "データ分析",
        href: "/admin/analytics",
        icon: PanelLeft,
        current: pathname.startsWith("/admin/analytics"),
      },
    ],
    [pathname],
  )

  // 2. ログアウト処理をuseCallbackでメモ化
  const handleLogout = useCallback(() => {
    // 実際の実装ではログアウト処理を行う
    toast({
      title: "ログアウト成功",
      description: "ログアウトしました",
    })
    router.push("/")
  }, [toast, router])

  // 3. Sidebarコンポーネントをメモ化して不要な再レンダリングを防止
  const Sidebar = useCallback(
    () => (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r h-full">
        <div className="flex h-16 shrink-0 items-center px-6 border-b">
          <Link href="/admin/dashboard" className="text-xl font-semibold">
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
                      prefetch={true}
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

  // 4. モバイルメニューの開閉処理をuseCallbackでメモ化
  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open)
  }, [])

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
            <button type="button" className="-m-2.5 p-2.5 text-slate-700 lg:hidden" onClick={() => setOpen(true)}>
              <span className="sr-only">サイドバーを開く</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="relative">
                <Button variant="ghost" className="flex items-center gap-2 px-2" onClick={handleLogout}>
                  <User className="h-5 w-5" />
                  <span>管理者</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <span className="sr-only">ログアウト</span>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
