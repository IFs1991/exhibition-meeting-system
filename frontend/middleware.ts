import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 認証不要のパス
const publicPaths = ['/login', '/register', '/', '/api/auth'];

// 管理者専用パス
const adminPaths = ['/admin'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 認証が必要なルートのパターン
  const protectedRoutes = ['/dashboard', '/admin', '/client']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // 認証が必要なルートにアクセスしようとしている場合
  if (isProtectedRoute) {
    if (!session) {
      // 未認証の場合はログインページにリダイレクト
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ユーザーのロールに基づいてアクセス制御
    const userRole = session.user.user_metadata.role

    // 管理者専用ルートへのアクセス制御
    if (request.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // クライアント専用ルートへのアクセス制御
    if (request.nextUrl.pathname.startsWith('/client') && userRole !== 'client') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 認証済みユーザーがログインページにアクセスした場合
  // if (session && request.nextUrl.pathname === '/login') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}