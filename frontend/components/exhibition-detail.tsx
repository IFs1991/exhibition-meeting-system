"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalendarDays, MapPin, Users, Clock, Building, Edit } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// 展示会データの型定義
export interface Exhibition {
  id: string;
  name: string;
  description: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  openingHours: string;
  organizerName: string;
  organizerContact: string;
  status: "planning" | "active" | "completed" | "canceled";
  maxAttendees: number;
  currentAttendees: number;
  imageUrl?: string;
  categories: string[];
  features: string[];
}

// 関連するクライアント型定義
interface Client {
  id: string;
  companyName: string;
  name: string;
  email: string;
}

// 商談予約の型定義
interface Meeting {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "canceled";
}

interface ExhibitionDetailProps {
  exhibition: Exhibition;
  relatedClients?: Client[];
  scheduledMeetings?: Meeting[];
  isAdmin?: boolean;
}

export function ExhibitionDetail({
  exhibition,
  relatedClients = [],
  scheduledMeetings = [],
  isAdmin = false
}: ExhibitionDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // 開催ステータスに応じたバッジの色を設定
  const getStatusBadge = (status: Exhibition["status"]) => {
    switch (status) {
      case "planning":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">計画中</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">開催中</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">終了</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">中止</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{exhibition.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            {getStatusBadge(exhibition.status)}
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/exhibitions/${exhibition.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="clients">参加クライアント</TabsTrigger>
          <TabsTrigger value="meetings">予約済商談</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>展示会情報</CardTitle>
              <CardDescription>展示会の基本情報</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">説明</h3>
                <p className="text-sm text-muted-foreground mt-1">{exhibition.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> 開催場所
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{exhibition.venue}</p>
                  <p className="text-sm text-muted-foreground">{exhibition.address}</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> 開催時間
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{exhibition.openingHours}</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Building className="mr-2 h-4 w-4" /> 主催者
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{exhibition.organizerName}</p>
                  <p className="text-sm text-muted-foreground">{exhibition.organizerContact}</p>
                </div>

                <div>
                  <h3 className="font-medium flex items-center">
                    <Users className="mr-2 h-4 w-4" /> 参加者数
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exhibition.currentAttendees} / {exhibition.maxAttendees} (現在 / 最大)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>カテゴリーと特徴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">カテゴリー</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exhibition.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">特徴</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exhibition.features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>参加クライアント一覧</CardTitle>
              <CardDescription>この展示会に登録しているクライアント</CardDescription>
            </CardHeader>
            <CardContent>
              {relatedClients.length > 0 ? (
                <div className="space-y-4">
                  {relatedClients.map((client) => (
                    <div key={client.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{client.companyName}</p>
                        <p className="text-sm text-muted-foreground">{client.name} | {client.email}</p>
                      </div>
                      {isAdmin && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/clients/${client.id}`}>詳細</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">登録クライアントはまだありません</p>
              )}
            </CardContent>
            {isAdmin && (
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/admin/exhibitions/${exhibition.id}/clients`}>
                    クライアント管理
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>予約済商談一覧</CardTitle>
              <CardDescription>この展示会に関連する商談予約</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledMeetings.length > 0 ? (
                <div className="space-y-4">
                  {scheduledMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{meeting.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(meeting.date)} {meeting.startTime} - {meeting.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">{meeting.clientName}</p>
                      </div>
                      <Badge
                        variant={
                          meeting.status === "confirmed"
                            ? "default"
                            : meeting.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {meeting.status === "confirmed"
                          ? "確定"
                          : meeting.status === "pending"
                            ? "保留中"
                            : "キャンセル"
                        }
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">予約済商談はまだありません</p>
              )}
            </CardContent>
            {isAdmin && (
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/admin/exhibitions/${exhibition.id}/meetings`}>
                    商談管理
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
