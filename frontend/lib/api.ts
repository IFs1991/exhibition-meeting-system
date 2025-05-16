"use client";

/**
 * バックエンドAPIとの通信を行うユーティリティ関数
 */

// APIベースURLの設定（環境変数から取得、ない場合はデフォルト値を使用）
const API_BASE_URL = (() => {
  // 環境変数からURLを取得
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // 環境変数が設定されている場合はそれを使用
  if (envUrl) return envUrl;

  // 開発環境の場合はlocalhostを使用
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }

  // 本番環境の場合は相対パスを使用（同一オリジンからのリクエスト）
  return '/api';
})();

// URLが正しく設定されているかコンソールに出力（デバッグ用）
console.log('API_BASE_URL:', API_BASE_URL);

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  headers?: HeadersInit;
  body?: any;
  credentials?: RequestCredentials;
  retries?: number; // 再試行回数
  retryDelay?: number; // 再試行間の待機時間（ミリ秒）
}

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
async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    credentials = 'include',
    retries = 2, // デフォルトで2回再試行
    retryDelay = 1000 // デフォルトで1秒待機
  } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials,
    mode: 'cors', // CORSモードを明示的に設定
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  // 再試行を含むフェッチロジック
  let lastError: Error | null = null;
  let retryCount = 0;

  while (retryCount <= retries) {
    try {
      if (retryCount > 0) {
        console.log(`APIリクエスト再試行 (${retryCount}/${retries}): ${API_BASE_URL}${endpoint}`);
        // 再試行前に待機
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.log(`APIリクエスト: ${API_BASE_URL}${endpoint}`, { method, body });
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`APIエラー: ${response.status} ${response.statusText}`, errorData);
        throw new Error(errorData.message || `APIリクエストエラー: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      lastError = error as Error;

      // ネットワークエラーのみ再試行
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        retryCount++;
        if (retryCount <= retries) {
          continue; // 再試行
        }
      } else {
        // その他のエラーは即時スロー
        break;
      }
    }
  }

  // すべての再試行が失敗した場合
  console.error(`API通信エラー (${retries}回再試行後): ${API_BASE_URL}${endpoint}`, lastError);
  if (lastError instanceof TypeError && lastError.message.includes('Failed to fetch')) {
    throw new Error(`サーバーに接続できません。バックエンドサーバーが実行中であることを確認してください。URL: ${API_BASE_URL}`);
  }
  throw lastError;
}

/**
 * 認証関連API
 */
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (userData: any) =>
    fetchAPI<{ user: any }>('/auth/register', {
      method: 'POST',
      body: userData,
    }),

  logout: () =>
    fetchAPI<void>('/auth/logout', { method: 'POST' }),

  getProfile: () =>
    fetchAPI<{ user: any }>('/auth/profile'),

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
  getAll: (params?: PaginationParams) =>
    fetchAPI<{ clients: any[]; total: number; page: number; totalPages: number }>('/clients', {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
    }),

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
  getAll: (params?: PaginationParams) =>
    fetchAPI<{ exhibitions: any[]; total: number; page: number; totalPages: number }>('/exhibitions', {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
    }),

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
  getRelatedClients: (id: string, params?: PaginationParams) =>
    fetchAPI<{ clients: any[]; total: number; page: number; totalPages: number }>(`/exhibitions/${id}/clients`, {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
    }),

  // 展示会に関連する商談予約一覧を取得
  getScheduledMeetings: (id: string, params?: PaginationParams) =>
    fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(`/exhibitions/${id}/meetings`, {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
    }),

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
  getAll: (params?: PaginationParams) =>
    fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>('/meetings', {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
    }),

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

  cancel: (id: string, reason?: string) =>
    fetchAPI<void>(`/meetings/${id}/cancel`, {
      method: 'POST',
      body: { reason }
    }),

  // 特定の展示会IDに関連する商談一覧取得
  getByExhibitionId: (exhibitionId: string, params?: PaginationParams) =>
    fetchAPI<{ meetings: any[]; total: number; page: number; totalPages: number }>(`/exhibitions/${exhibitionId}/meetings`, {
      method: 'GET',
      headers: params ? { 'Query-Params': JSON.stringify(params) } : undefined
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

export default {
  auth: authAPI,
  client: clientAPI,
  exhibition: exhibitionAPI,
  meeting: meetingAPI,
  stats: statsAPI,
  ai: aiAPI,
};