"use client";

/**
 * バックエンドAPIとの通信を行うユーティリティ関数
 */

import { createClient } from '@/lib/supabase/client'

// APIベースURLの設定（環境変数から取得、ない場合はデフォルト値を使用）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// URLが正しく設定されているかコンソールに出力（デバッグ用）
console.log('API_BASE_URL:', API_BASE_URL);

/**
 * ページネーションパラメータの型
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * API呼び出しを行う汎用関数
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
    throw new Error('認証が必要です。再ログインしてください。')
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
    ...options.headers,
  }

  // optionsからbodyを取り出し、オブジェクトの場合はJSON文字列に変換
  const { body, ...restOptions } = options as any

  const requestOptions = {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

/**
 * 認証関連API
 */
export const authAPI = {
  // ログインはSupabaseが直接処理するため不要
  // profileの取得はバックエンドから取得する
  getProfile: () =>
    fetchAPI<{ user: any }>('/auth/profile'),

  // プロファイル更新
  updateProfile: (userData: any) =>
    fetchAPI<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: userData
    }),
};

/**
 * クライアント管理API
 */
export const clientAPI = {
  getAll: (params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ clients: any[]; total: number; page: number; totalPages: number }>(
      `/clients${queryParams ? `?${queryParams}` : ''}`
    );
  },

  getById: (id: string) =>
    fetchAPI<{ client: any }>(`/clients/${id}`),

  create: (clientData: any) =>
    fetchAPI<{ client: any }>('/clients', {
      method: 'POST',
      body: clientData,
    }),

  update: (id: string, clientData: any) =>
    fetchAPI<{ client: any }>(`/clients/${id}`, {
      method: 'PUT',
      body: clientData,
    }),

  delete: (id: string) =>
    fetchAPI<void>(`/clients/${id}`, { method: 'DELETE' }),
};

/**
 * 展示会管理API
 */
export const exhibitionAPI = {
  getAll: (params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ exhibitions: any[]; total: number; page: number; totalPages: number }>(
      `/exhibitions${queryParams ? `?${queryParams}` : ''}`
    );
  },

  getById: (id: string) =>
    fetchAPI<{ exhibition: any }>(`/exhibitions/${id}`),

  create: (exhibitionData: any) =>
    fetchAPI<{ exhibition: any }>('/exhibitions', {
      method: 'POST',
      body: exhibitionData,
    }),

  update: (id: string, exhibitionData: any) =>
    fetchAPI<{ exhibition: any }>(`/exhibitions/${id}`, {
      method: 'PUT',
      body: exhibitionData,
    }),

  delete: (id: string) =>
    fetchAPI<void>(`/exhibitions/${id}`, { method: 'DELETE' }),

  // 展示会に関連するクライアント一覧を取得
  getRelatedClients: (id: string, params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ clients: any[]; total: number; page: number; totalPages: number }>(
      `/exhibitions/${id}/clients${queryParams ? `?${queryParams}` : ''}`
    );
  },

  // 展示会に関連する商談予約一覧を取得
  getScheduledMeetings: (id: string, params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(
      `/exhibitions/${id}/meetings${queryParams ? `?${queryParams}` : ''}`
    );
  },

  // クライアントを展示会に登録
  addClient: (exhibitionId: string, clientId: string, data?: any) =>
    fetchAPI<void>(`/exhibitions/${exhibitionId}/clients/${clientId}`, {
      method: 'POST',
      body: data
    }),

  // クライアントの展示会登録を解除
  removeClient: (exhibitionId: string, clientId: string) =>
    fetchAPI<void>(`/exhibitions/${exhibitionId}/clients/${clientId}`, {
      method: 'DELETE'
    }),
};

/**
 * 商談管理API
 */
export const meetingAPI = {
  getAll: (params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(
      `/meetings${queryParams ? `?${queryParams}` : ''}`
    );
  },

  getById: (id: string) =>
    fetchAPI<{ meeting: any }>(`/meetings/${id}`),

  create: (meetingData: any) =>
    fetchAPI<{ meeting: any }>('/meetings', {
      method: 'POST',
      body: meetingData,
    }),

  update: (id: string, meetingData: any) =>
    fetchAPI<{ meeting: any }>(`/meetings/${id}`, {
      method: 'PUT',
      body: meetingData,
    }),

  delete: (id: string) =>
    fetchAPI<void>(`/meetings/${id}`, { method: 'DELETE' }),

  // 特定のクライアントの商談予約一覧を取得
  getByClientId: (clientId: string, params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(
      `/clients/${clientId}/meetings${queryParams ? `?${queryParams}` : ''}`
    );
  },

  // 特定の展示会の商談予約一覧を取得
  getByExhibitionId: (exhibitionId: string, params?: PaginationParams) => {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString() : '';

    return fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(
      `/exhibitions/${exhibitionId}/meetings${queryParams ? `?${queryParams}` : ''}`
    );
  },

  // 商談ステータスを更新
  updateStatus: (id: string, status: string) =>
    fetchAPI<{ meeting: any }>(`/meetings/${id}/status`, {
      method: 'PATCH',
      body: { status }
    }),

  // フィードバックを登録
  addFeedback: (id: string, feedback: string) =>
    fetchAPI<{ meeting: any }>(`/meetings/${id}/feedback`, {
      method: 'POST',
      body: { feedback }
    }),
};

/**
 * 統計データAPI
 */
export const statsAPI = {
  getStats: (params: any) =>
    fetchAPI<any>('/stats', {
      method: 'GET',
      headers: { 'Query-Params': JSON.stringify(params) }
    }),

  // 期間指定の統計データ取得
  getTimeSeriesData: (params: { startDate: string; endDate: string; metric: string; groupBy?: string }) =>
    fetchAPI<{ data: any[]; labels: string[] }>('/stats/timeseries', {
      method: 'GET',
      headers: { 'Query-Params': JSON.stringify(params) }
    }),

  // 展示会毎の統計データ取得
  getExhibitionStats: (exhibitionId: string) =>
    fetchAPI<{
      attendees: number;
      meetings: number;
      conversionRate: number;
      topClients: any[]
    }>(`/stats/exhibitions/${exhibitionId}`, {
      method: 'GET'
    }),
};

/**
 * AI連携API
 */
export const aiAPI = {
  generateSuggestion: (prompt: string, context?: any) =>
    fetchAPI<{ result: string }>('/ai/suggest', {
      method: 'POST',
      body: { prompt, context },
    }),

  // 商談目的文の生成支援
  generateMeetingPurpose: (params: {
    clientInfo?: any;
    exhibitionInfo?: any;
    keywords?: string[];
  }) =>
    fetchAPI<{ suggestions: string[] }>('/ai/meeting-purpose', {
      method: 'POST',
      body: params
    }),
};

// APIエンドポイントの型定義
export interface APIEndpoints {
  // 展示会関連
  exhibitions: {
    list: '/api/exhibitions'
    detail: (id: string) => `/api/exhibitions/${id}`
    create: '/api/exhibitions'
    update: (id: string) => `/api/exhibitions/${id}`
    delete: (id: string) => `/api/exhibitions/${id}`
  }
  // 商談関連
  meetings: {
    list: '/api/meetings'
    detail: (id: string) => `/api/meetings/${id}`
    create: '/api/meetings'
    update: (id: string) => `/api/meetings/${id}`
    delete: (id: string) => `/api/meetings/${id}`
  }
  // ユーザー関連
  users: {
    profile: '/api/users/profile'
    updateProfile: '/api/users/profile'
  }
}

// APIエンドポイントの定義
export const API: APIEndpoints = {
  exhibitions: {
    list: '/api/exhibitions',
    detail: (id) => `/api/exhibitions/${id}`,
    create: '/api/exhibitions',
    update: (id) => `/api/exhibitions/${id}`,
    delete: (id) => `/api/exhibitions/${id}`,
  },
  meetings: {
    list: '/api/meetings',
    detail: (id) => `/api/meetings/${id}`,
    create: '/api/meetings',
    update: (id) => `/api/meetings/${id}`,
    delete: (id) => `/api/meetings/${id}`,
  },
  users: {
    profile: '/api/users/profile',
    updateProfile: '/api/users/profile',
  },
}

export default {
  auth: authAPI,
  client: clientAPI,
  exhibition: exhibitionAPI,
  meeting: meetingAPI,
  stats: statsAPI,
  ai: aiAPI,
};