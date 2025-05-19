"use client";

import { exhibitionAPI } from "@/lib/api";
import { getAllExhibitions, getPublicExhibitions } from "@/lib/supabase/queries";

/**
 * パフォーマンス測定用ユーティリティ
 * API呼び出しとSupabase直接クエリのパフォーマンスを比較します
 */

export interface PerformanceResult {
  name: string;
  duration: number;
  success: boolean;
  error?: string;
  dataSize?: number;
}

/**
 * パフォーマンス測定を実行する関数
 * @param iterations 各テストの実行回数
 * @returns 測定結果の配列
 */
export async function runPerformanceTests(iterations: number = 5): Promise<PerformanceResult[]> {
  const results: PerformanceResult[] = [];

  // ウォームアップのための呼び出し
  try {
    await exhibitionAPI.getAll();
    await getPublicExhibitions();
  } catch (e) {
    console.log("ウォームアップでエラーが発生しました", e);
  }

  // APIによる展示会一覧取得のパフォーマンス測定
  for (let i = 0; i < iterations; i++) {
    const result = await measurePerformance("API: 展示会一覧取得", async () => {
      const data = await exhibitionAPI.getAll();
      return data.exhibitions;
    });
    results.push(result);
  }

  // Supabase直接クエリによる展示会一覧取得のパフォーマンス測定
  for (let i = 0; i < iterations; i++) {
    const result = await measurePerformance("Supabase: 展示会一覧取得", async () => {
      return await getAllExhibitions();
    });
    results.push(result);
  }

  // Supabase直接クエリによる公開展示会一覧取得のパフォーマンス測定
  for (let i = 0; i < iterations; i++) {
    const result = await measurePerformance("Supabase: 公開展示会一覧取得", async () => {
      return await getPublicExhibitions();
    });
    results.push(result);
  }

  return results;
}

/**
 * 関数の実行時間を測定する
 * @param name テスト名
 * @param fn 測定対象の関数
 * @returns 測定結果
 */
async function measurePerformance(name: string, fn: () => Promise<any>): Promise<PerformanceResult> {
  const start = performance.now();
  let success = false;
  let error = undefined;
  let data = undefined;
  let dataSize = undefined;

  try {
    data = await fn();
    success = true;
    dataSize = Array.isArray(data) ? data.length : (data ? 1 : 0);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const end = performance.now();
  const duration = end - start;

  return {
    name,
    duration,
    success,
    error,
    dataSize
  };
}

/**
 * 測定結果の平均値を計算する
 * @param results 測定結果の配列
 * @returns 測定名ごとの平均実行時間
 */
export function calculateAverageResults(results: PerformanceResult[]): Record<string, number> {
  const grouped: Record<string, PerformanceResult[]> = {};

  // 名前ごとにグループ化
  for (const result of results) {
    if (!grouped[result.name]) {
      grouped[result.name] = [];
    }
    grouped[result.name].push(result);
  }

  // 各グループの平均を計算
  const averages: Record<string, number> = {};
  for (const [name, groupResults] of Object.entries(grouped)) {
    const successfulResults = groupResults.filter(r => r.success);
    if (successfulResults.length > 0) {
      const sum = successfulResults.reduce((acc, r) => acc + r.duration, 0);
      averages[name] = sum / successfulResults.length;
    } else {
      averages[name] = 0; // 成功したテストがない場合は0とする
    }
  }

  return averages;
}