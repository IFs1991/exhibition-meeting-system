import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証不要のパス
const publicPaths = ['/login', '/register', '/', '/api/auth'];

// 管理者専用パス
const adminPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // リクエスト情報の詳細なログ出力
  console.log(`[Middleware] Processing path: ${pathname}`);
  console.log(`[Middleware] Cookies:`, {
    auth_token: request.cookies.get('auth_token')?.value ? "存在します" : "存在しません",
    user_role: request.cookies.get('user_role')?.value || "未設定",
    all_cookies: [...request.cookies.getAll()].map(c => `${c.name}=${c.value.substring(0, 10)}...`)
  });

  // /client パスへの直接アクセスをダッシュボードにリダイレクト（最優先で処理）
  if (pathname === '/client' || pathname === '/client/') {
    console.log('[Middleware] /client へのアクセスを /client/dashboard にリダイレクト');
    const dashboardUrl = new URL('/client/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 同様に、/admin パスへの直接アクセスもダッシュボードにリダイレクト
  if (pathname === '/admin' || pathname === '/admin/') {
    console.log('[Middleware] /admin へのアクセスを /admin/dashboard にリダイレクト');
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // publicPathsの場合は認証チェックをスキップ
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log(`[Middleware] 公開パスのためスキップ: ${pathname}`);
    return NextResponse.next();
  }

  try {
    // クッキーからセッショントークンとユーザーロールを取得
    const authToken = request.cookies.get('auth_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    // 認証されていない場合はログインページにリダイレクト
    if (!authToken) {
      console.log(`[Middleware] 認証トークンなし: ${pathname} -> /login へリダイレクト`);
      const url = new URL('/login', request.url);
      url.searchParams.set('from', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // ユーザーロールが存在しない場合もログインに戻す
    if (!userRole) {
      console.error('[Middleware] ユーザーロールのCookieが見つかりません');
      const url = new URL('/login', request.url);
      url.searchParams.set('error', 'missing_role');
      return NextResponse.redirect(url);
    }

    // 管理者専用パスへのアクセスをチェック
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      console.log(`[Middleware] 非管理者が管理者ページにアクセスしようとしました: Role=${userRole}, Path=${pathname}`);
      // 管理者権限がない場合はクライアントダッシュボードにリダイレクト
      return NextResponse.redirect(new URL('/client/dashboard', request.url));
    }

    // クライアント専用パスに管理者がアクセスした場合は許可（管理者は全ての画面にアクセス可能）
    if (pathname.startsWith('/client') && userRole === 'admin') {
      console.log(`[Middleware] 管理者がクライアントページにアクセス: Role=${userRole}, Path=${pathname}`);
      return NextResponse.next();
    }

    console.log(`[Middleware] アクセス許可: Role=${userRole}, Path=${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] エラー:', error);
    // エラーが発生した場合もログインページにリダイレクト
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'middleware_error');
    return NextResponse.redirect(url);
  }
}

export const config = {
  // 以下のパターンにマッチするパスに対してミドルウェアを適用
  matcher: [
    // public pathsを除外
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};