import { createClient } from '@supabase/supabase-js'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

describe('認証フロー', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'test-password-123',
    fullName: 'Test User',
  }

  beforeAll(async () => {
    // テストユーザーの作成
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
  })

  afterAll(async () => {
    // テストユーザーの削除
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.auth.signOut()
    }
  })

  it('ログインできること', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })

    expect(error).toBeNull()
    expect(data.session).not.toBeNull()
    expect(data.user).not.toBeNull()
    expect(data.user?.email).toBe(testUser.email)
    expect(data.user?.user_metadata.full_name).toBe(testUser.fullName)
  })

  it('ログアウトできること', async () => {
    const { error } = await supabase.auth.signOut()
    expect(error).toBeNull()

    const { data: { session } } = await supabase.auth.getSession()
    expect(session).toBeNull()
  })

  it('プロファイルを更新できること', async () => {
    // まずログイン
    await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })

    const newFullName = 'Updated Test User'
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: newFullName,
      },
    })

    expect(error).toBeNull()
    expect(data.user?.user_metadata.full_name).toBe(newFullName)
  })

  it('無効な認証情報でログインできないこと', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: 'wrong-password',
    })

    expect(error).not.toBeNull()
    expect(data.session).toBeNull()
    expect(data.user).toBeNull()
  })
})