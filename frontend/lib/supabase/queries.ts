import { createClient } from './client'

export interface Exhibition {
  id: string
  name: string
  venue?: string
  startDate: string
  endDate: string
  status?: string
  currentAttendees?: number
  maxAttendees?: number
  organizerName?: string
  description?: string
  location?: string
  isPublic?: boolean
  additionalInfo?: string
  contactEmail?: string
  contactPhone?: string
}

export interface Client {
  id: string
  name: string
  email: string
  companyName: string
  phone?: string
  address?: string
  createdAt: string
}

export interface Profile {
  id: string
  fullName: string
  companyName?: string
  clinicName?: string
  phoneNumber?: string
  address?: string
  role: 'admin' | 'client'
  isActive: boolean
  lastLoginAt?: string
}

export interface Meeting {
  id: string
  exhibitionId: string
  clientId: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  feedback?: string
  createdAt: string
}

// 公開されている展示会一覧を取得（RLSで全ユーザーに公開）
export async function getPublicExhibitions(): Promise<Exhibition[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('isPublic', true)
    .order('startDate', { ascending: true })
  if (error) throw error
  return data as Exhibition[]
}

// 全ての展示会を取得（管理者用）
export async function getAllExhibitions(): Promise<Exhibition[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .order('startDate', { ascending: false })
  if (error) throw error
  return data as Exhibition[]
}

// 全てのクライアントを取得（管理者用）
export async function getAllClients(): Promise<Client[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('createdAt', { ascending: false })
  if (error) throw error
  return data as Client[]
}

// 自分のプロファイル情報を取得
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = createClient()

  // まず現在のユーザーIDを取得
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  // プロファイル情報を取得
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data as Profile
}

// 特定の展示会の詳細を取得
export async function getExhibitionById(id: string): Promise<Exhibition | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // 結果が見つからない場合
    throw error
  }
  return data as Exhibition
}

// 自分の商談予約一覧を取得（クライアント用）
export async function getMyMeetings(): Promise<Meeting[]> {
  const supabase = createClient()

  // まず現在のユーザーIDを取得
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('clientId', session.user.id)
    .order('startTime', { ascending: true })

  if (error) throw error
  return data as Meeting[]
}