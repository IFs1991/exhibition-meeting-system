import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { fetchAPI } from '@/lib/api'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe('APIクライアント', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'test-password-123',
    fullName: 'Test User',
  }

  beforeAll(async () => {
    // テストユーザーの作成とログイン
    const { error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName,
          role: 'client',
        },
      },
    })
    expect(error).toBeNull()

    await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })
  })

  afterAll(async () => {
    // テストユーザーの削除
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.auth.signOut()
    }
  })

  it('認証ヘッダーが正しく設定されること', async () => {
    const { data: { session } } = await supabase.auth.getSession()
    expect(session).not.toBeNull()

    const response = await fetchAPI('/api/auth/me') as Response
    expect(response.status).toBe(200)
    expect(response.headers.get('authorization')).toBe(`Bearer ${session?.access_token}`)
  })

  it('認証されていない状態でアクセスできないこと', async () => {
    await supabase.auth.signOut()

    const response = await fetchAPI('/api/auth/me') as Response
    expect(response.status).toBe(401)
  })

  it('APIエンドポイントが正しく動作すること', async () => {
    // ログインし直す
    await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })

    // 展示会一覧の取得
    const exhibitionsResponse = await fetchAPI('/api/exhibitions') as Response
    expect(exhibitionsResponse.status).toBe(200)

    // ミーティング一覧の取得
    const meetingsResponse = await fetchAPI('/api/meetings') as Response
    expect(meetingsResponse.status).toBe(200)

    // ユーザープロファイルの取得
    const profileResponse = await fetchAPI('/api/auth/me') as Response
    expect(profileResponse.status).toBe(200)
    const profileData = await profileResponse.json()
    expect(profileData.email).toBe(testUser.email)
    expect(profileData.full_name).toBe(testUser.fullName)
  })
})