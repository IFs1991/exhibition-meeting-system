"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// 動的インポートでチャートコンポーネントを遅延ロード
const DynamicPieChart = dynamic(() => import("./charts").then((mod) => mod.PieChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
})

const DynamicBarChart = dynamic(() => import("./charts").then((mod) => mod.BarChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
})

const DynamicLineChart = dynamic(() => import("./charts").then((mod) => mod.LineChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
})

interface LazyChartProps {
  type: "pie" | "bar" | "line"
  title: string
  description?: string
  data: any[]
  options?: any
}

export function LazyChart({ type, title, description, data, options }: LazyChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {!isClient ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              {type === "pie" && <DynamicPieChart data={data} options={options} />}
              {type === "bar" && <DynamicBarChart data={data} options={options} />}
              {type === "line" && <DynamicLineChart data={data} options={options} />}
            </Suspense>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
