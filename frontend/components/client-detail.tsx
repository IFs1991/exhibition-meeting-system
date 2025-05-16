import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Mail, Phone, Globe, MapPin, Calendar } from "lucide-react"

// クライアントデータの型定義
export interface ClientDetailProps {
  client: {
    id: number
    companyName: string
    contactPerson: string
    email: string
    industry: string
    phone?: string
    website?: string
    address?: string
    status: "active" | "inactive"
    exhibitions: {
      id: number
      name: string
    }[]
    meetingCount: number
    notes?: string
  }
  isLoading?: boolean
}

export function ClientDetail({ client, isLoading = false }: ClientDetailProps) {
  if (isLoading) {
    return <ClientDetailSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Building2 className="h-8 w-8 text-muted-foreground mt-1" />
              <div>
                <CardTitle className="text-xl">{client.companyName}</CardTitle>
                <CardDescription className="mt-1">
                  担当者: {client.contactPerson} | {client.email}
                </CardDescription>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center gap-2">
              <Badge variant="outline">{client.industry}</Badge>
              <Badge variant={client.status === "active" ? "default" : "outline"}>
                {client.status === "active" ? "有効" : "無効"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">連絡先情報</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </li>
                  {client.phone && (
                    <li className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </li>
                  )}
                  {client.website && (
                    <li className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {client.website}
                      </a>
                    </li>
                  )}
                  {client.address && (
                    <li className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{client.address}</span>
                    </li>
                  )}
                </ul>
              </div>

              {client.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">備考</h3>
                  <p className="text-sm">{client.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">参加展示会</h3>
                <div className="flex flex-wrap gap-2">
                  {client.exhibitions.map((exhibition) => (
                    <Badge key={exhibition.id} variant="secondary">
                      {exhibition.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">商談情報</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">総商談数: {client.meetingCount}件</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-md" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-32" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
