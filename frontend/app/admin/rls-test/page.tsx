"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { testAllRlsPolicies, testProfilesAccess, testExhibitionsAccess, testMeetingsAccess } from "@/lib/supabase/rls-test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/supabase/queries";

export default function RlsTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useAuth();

  // ユーザーロールを取得
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const profile = await getMyProfile();
          setUserRole(profile?.role || null);
        } catch (error) {
          console.error("プロファイル取得エラー:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // テスト実行関数
  const runTest = async () => {
    setIsLoading(true);
    try {
      let results;
      switch (currentTab) {
        case "profiles":
          results = await testProfilesAccess();
          break;
        case "exhibitions":
          results = await testExhibitionsAccess();
          break;
        case "meetings":
          results = await testMeetingsAccess();
          break;
        default:
          results = await testAllRlsPolicies();
          break;
      }
      setTestResults(results);
    } catch (error) {
      console.error("テスト実行エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 結果を整形して表示するヘルパー関数
  const formatResults = (results: any) => {
    if (!results) return null;

    // 全てのテスト結果を表示
    if (currentTab === "all") {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">プロファイルアクセスのテスト結果</h3>
            {formatProfileResults(results.profiles)}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">展示会アクセスのテスト結果</h3>
            {formatExhibitionResults(results.exhibitions)}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">商談アクセスのテスト結果</h3>
            {formatMeetingResults(results.meetings)}
          </div>
        </div>
      );
    }

    // 個別のテスト結果を表示
    switch (currentTab) {
      case "profiles":
        return formatProfileResults(results);
      case "exhibitions":
        return formatExhibitionResults(results);
      case "meetings":
        return formatMeetingResults(results);
      default:
        return <div>不明なタブ: {currentTab}</div>;
    }
  };

  // プロファイルテスト結果の表示
  const formatProfileResults = (results: any) => {
    if (!results) return null;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium">自分のプロファイルへのアクセス</h4>
          {results.selfProfileReadError ? (
            <Badge variant="destructive">失敗</Badge>
          ) : (
            <Badge variant="default" className="bg-green-500">成功</Badge>
          )}
          <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
            {JSON.stringify(results.selfProfileRead || results.selfProfileReadError, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-md font-medium">他のユーザーのプロファイルへのアクセス</h4>
          {results.otherProfileReadError ? (
            <div>
              <Badge variant="default" className="bg-green-500">適切に制限されています</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherProfileReadError, null, 2)}
              </pre>
            </div>
          ) : userRole === "admin" ? (
            <div>
              <Badge variant="default" className="bg-green-500">管理者は他のプロファイルにアクセス可能</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherProfileRead, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <Badge variant="destructive">RLSポリシーが正しく機能していません</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherProfileRead, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 展示会テスト結果の表示
  const formatExhibitionResults = (results: any) => {
    if (!results) return null;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium">公開展示会へのアクセス</h4>
          {results.publicExhibitionsError ? (
            <Badge variant="destructive">失敗</Badge>
          ) : (
            <Badge variant="default" className="bg-green-500">成功</Badge>
          )}
          <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
            {JSON.stringify(results.publicExhibitionsRead || results.publicExhibitionsError, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-md font-medium">非公開展示会へのアクセス</h4>
          {results.privateExhibitionsError && userRole !== "admin" ? (
            <div>
              <Badge variant="default" className="bg-green-500">適切に制限されています</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.privateExhibitionsError, null, 2)}
              </pre>
            </div>
          ) : userRole === "admin" ? (
            <div>
              <Badge variant="default" className="bg-green-500">管理者は非公開展示会にアクセス可能</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.privateExhibitionsRead, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <Badge variant="destructive">RLSポリシーが正しく機能していません</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.privateExhibitionsRead, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 商談テスト結果の表示
  const formatMeetingResults = (results: any) => {
    if (!results) return null;
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium">自分の商談へのアクセス</h4>
          {results.selfMeetingsError ? (
            <Badge variant="destructive">失敗</Badge>
          ) : (
            <Badge variant="default" className="bg-green-500">成功</Badge>
          )}
          <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
            {JSON.stringify(results.selfMeetingsRead || results.selfMeetingsError, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-md font-medium">他のユーザーの商談へのアクセス</h4>
          {results.otherMeetingsError && userRole !== "admin" ? (
            <div>
              <Badge variant="default" className="bg-green-500">適切に制限されています</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherMeetingsError, null, 2)}
              </pre>
            </div>
          ) : userRole === "admin" ? (
            <div>
              <Badge variant="default" className="bg-green-500">管理者は他のユーザーの商談にアクセス可能</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherMeetingsRead, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <Badge variant="destructive">RLSポリシーが正しく機能していません</Badge>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-40">
                {JSON.stringify(results.otherMeetingsRead, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RLSポリシーテスト</h1>
          <p className="text-muted-foreground mt-1">Supabase Row Level Security ポリシーのテストを実行します</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>テスト対象の選択</CardTitle>
            <CardDescription>テストしたいRLSポリシーのカテゴリを選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="mb-4">
                <span className="font-medium">現在のユーザーロール:</span>{" "}
                {userRole ? (
                  <Badge variant="outline">{userRole}</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100">取得中...</Badge>
                )}
              </div>
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all">全て</TabsTrigger>
                  <TabsTrigger value="profiles">プロファイル</TabsTrigger>
                  <TabsTrigger value="exhibitions">展示会</TabsTrigger>
                  <TabsTrigger value="meetings">商談</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={runTest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  テスト実行中...
                </>
              ) : (
                "テスト実行"
              )}
            </Button>
          </CardFooter>
        </Card>

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle>テスト結果</CardTitle>
              <CardDescription>RLSポリシーの動作結果</CardDescription>
            </CardHeader>
            <CardContent>
              {formatResults(testResults)}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}