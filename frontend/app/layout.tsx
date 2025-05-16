import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CompanyProvider } from "@/contexts/company-context"
import { Toaster } from "../components/ui/toaster"
import { AuthProvider } from "../contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "展示会商談管理システム",
  description: "展示会の商談を効率的に管理するSaaSアプリケーション",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <CompanyProvider>
              {children}
              <Toaster />
            </CompanyProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
