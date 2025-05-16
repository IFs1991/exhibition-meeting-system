"use client"

import { ReactNode } from "react"
import ClientLayout from "@/components/client-layout"

export default function Layout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}