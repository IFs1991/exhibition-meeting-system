"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { runPerformanceTests, calculateAverageResults, PerformanceResult } from "@/lib/performance";
import { Loader2, BarChart } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PerformancePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [iterations, setIterations] = useState(5);
  const [results, setResults] = useState<PerformanceResult[]>([]);
  const [averages, setAverages] = useState<Record<string, number>>({});

  // パフォーマンステストを実行
  const runTests = async () => {
    setIsLoading(true);
    try {
      const testResults = await runPerformanceTests(iterations);
      setResults(testResults);
      const avgResults = calculateAverageResults(testResults);
      setAverages(avgResults);
    } catch (error) {
      console.error("パフォーマンステストエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 結果をCSV形式でエクスポート
  const exportResults = () => {
    if (!results.length) return;

    const headers = ["テスト名", "実行時間(ms)", "成功", "エラー", "データサイズ"];
    const rows = results.map(r => [
      r.name,
      r.duration.toFixed(2),
      r.success ? "成功" : "失敗",
      r.error || "",
      String(r.dataSize || "")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `performance-test-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // バーチャートのスタイルを定義
  const getBarStyle = (value: number, max: number) => {
    const percentage = Math.min((value / max) * 100, 100);
    return {
      width: `${percentage}%`,
      backgroundColor: percentage > 70 ? "#ef4444" : percentage > 40 ? "#f59e0b" : "#22c55e"
    };
  };

  // 平均値の最大値を取得
  const maxAverage = Object.values(averages).length > 0
    ? Math.max(...Object.values(averages))
    : 100;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">パフォーマンス測定</h1>
          <p className="text-muted-foreground mt-1">API呼び出しとSupabase直接クエリのパフォーマンスを比較します</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>テスト設定</CardTitle>
            <CardDescription>パフォーマンステストの実行回数を設定します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="iterations">繰り返し回数</Label>
                <Input
                  id="iterations"
                  type="number"
                  min="1"
                  max="20"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-24"
                />
                <p className="text-sm text-muted-foreground">各テストを何回繰り返すかを設定します（1〜20）</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={runTests} disabled={isLoading} className="mr-2">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  テスト実行中...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-4 w-4" />
                  テスト実行
                </>
              )}
            </Button>
            {results.length > 0 && (
              <Button variant="outline" onClick={exportResults}>
                結果をCSVエクスポート
              </Button>
            )}
          </CardFooter>
        </Card>

        {results.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>平均実行時間</CardTitle>
                <CardDescription>テスト名ごとの平均実行時間 (ミリ秒)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(averages).map(([name, value]) => (
                    <div key={name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{name}</span>
                        <span className="font-medium">{value.toFixed(2)} ms</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={getBarStyle(value, maxAverage)}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>詳細結果</CardTitle>
                <CardDescription>全てのテスト実行の詳細結果</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">テスト名</th>
                        <th className="py-2 px-4 text-left">実行時間 (ms)</th>
                        <th className="py-2 px-4 text-left">結果</th>
                        <th className="py-2 px-4 text-left">データサイズ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 px-4">{result.name}</td>
                          <td className="py-2 px-4">{result.duration.toFixed(2)}</td>
                          <td className="py-2 px-4">
                            {result.success ? (
                              <span className="text-green-600">成功</span>
                            ) : (
                              <span className="text-red-600">失敗: {result.error}</span>
                            )}
                          </td>
                          <td className="py-2 px-4">{result.dataSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}