# 展示会商談管理システム - Supabase接続手順

このドキュメントでは、展示会商談管理システムのバックエンドをSupabaseに接続する手順を説明します。

## 前提条件

- Node.js (v18以上)
- pnpm
- Supabaseアカウント
- Supabaseプロジェクト (URL: https://nhokzbxuicefnslfmrmp.supabase.co)

## 環境変数の設定

1. プロジェクトルートに `.env` ファイルを作成する
2. 以下の環境変数を設定する

```env
# アプリケーション設定
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:3000,http://localhost:4000

# Supabase接続設定
SUPABASE_URL=https://nhokzbxuicefnslfmrmp.supabase.co
SUPABASE_ANON_KEY=<Supabaseダッシュボードから取得した匿名キー>
SUPABASE_SERVICE_ROLE_KEY=<Supabaseダッシュボードから取得したサービスロールキー>
SUPABASE_JWT_SECRET=<Supabaseダッシュボードから取得したJWTシークレット>
```

Supabaseのキー情報は以下の手順で取得します：

1. [Supabaseダッシュボード](https://supabase.com/dashboard/project/nhokzbxuicefnslfmrmp) にアクセス
2. プロジェクト設定 > API から必要なキーを取得
   - `anon` public キー: `SUPABASE_ANON_KEY` に設定
   - `service_role` secret キー: `SUPABASE_SERVICE_ROLE_KEY` に設定
3. プロジェクト設定 > API > JWT Settings から JWT シークレットを取得
   - JWT Secret: `SUPABASE_JWT_SECRET` に設定

## パッケージのインストール

```bash
cd backend
pnpm install
pnpm add @supabase/supabase-js
```

## アプリケーションの起動

```bash
cd backend
pnpm start:dev
```

## Supabase認証の確認

アプリケーションが起動したら、以下のAPIにアクセスしてSupabase認証が正常に機能しているか確認できます：

```bash
# API URLの例
http://localhost:3000/api/users/profile
```

リクエストヘッダには、Supabase Authで取得したJWTトークンを付与します：

```
Authorization: Bearer <JWTトークン>
```

## データベースマイグレーション

データベースマイグレーションを実行するには：

```bash
cd backend
pnpm typeorm migration:run
```

これにより、必要なスキーマがSupabaseデータベースに作成されます。

## Supabase接続の確認方法

アプリケーション起動後に以下のエンドポイントにアクセスして、正常に接続できているか確認できます：

```bash
# ヘルスチェックAPI
http://localhost:3000/api/health
```

正常に接続できている場合、以下のようなレスポンスが返ります：

```json
{
  "status": "ok",
  "message": "Service is healthy",
  "supabaseConnection": "connected"
}
```