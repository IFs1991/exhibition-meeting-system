# フロントエンド・バックエンド接続仕様書

## 1. 概要

本ドキュメントでは、展示会商談管理システムにおけるフロントエンド（Next.js）とバックエンド（NestJS）間の接続仕様、および、フロントエンドからSupabase DBへの直接アクセス仕様について説明します。

## 2. 認証・認可フロー

### 2.1 認証フロー

1. ユーザーはフロントエンドのログインページでメールアドレスとパスワードを入力
2. フロントエンドは、Supabase Auth APIを利用してログイン処理を行う
   - `supabase.auth.signInWithPassword({ email, password })`
3. 認証に成功すると、Supabaseからアクセストークン（JWT）が発行される
4. アクセストークンはブラウザのローカルストレージに保存される
5. 以降のAPIリクエストには、このアクセストークンを`Authorization: Bearer [token]`ヘッダーとして付与する

### 2.2 認可フロー

1. バックエンドAPIは、リクエストヘッダーの`Authorization`からJWTを取得
2. Supabase JWTシークレットを使用してトークンを検証
3. トークンが有効な場合、ユーザーIDをリクエストオブジェクトに格納
4. `@Roles()`デコレータが設定されたエンドポイントは、`RolesGuard`によってロールベースの認可を実施
   - ユーザーのロールは`profiles`テーブルから取得

### 2.3 トークンリフレッシュ

- トークンの有効期限が近づくと、Supabaseクライアントライブラリが自動的にリフレッシュトークンを使用して新しいアクセストークンを取得
- リフレッシュトークンの有効期限が切れた場合は、再度ログインが必要

## 3. API接続仕様

### 3.1 共通ヘッダー

全APIリクエストには以下のヘッダーを含める:

```
Content-Type: application/json
Authorization: Bearer [Supabase JWT]
```

### 3.2 エラーハンドリング

バックエンドからのエラーレスポンスの形式:

```json
{
  "statusCode": 400,
  "message": "エラーメッセージ",
  "error": "エラータイプ",
  "details": {
    "field1": "フィールド1のエラー詳細",
    "field2": "フィールド2のエラー詳細"
  }
}
```

フロントエンドでは、`handleApiError`関数でエラーを処理し、適切なトースト通知を表示。

### 3.3 主要APIエンドポイント

| エンドポイント | メソッド | 説明 | 認証 | 必要な権限 |
|--------------|---------|-----|------|---------|
| /auth/profile | GET | ユーザープロファイル取得 | 必要 | - |
| /auth/profile | PUT | ユーザープロファイル更新 | 必要 | - |
| /clients | GET | クライアント一覧取得 | 必要 | admin |
| /clients/:id | GET | クライアント詳細取得 | 必要 | admin または self |
| /exhibitions | GET | 展示会一覧取得 | 必要 | - |
| /exhibitions/:id | GET | 展示会詳細取得 | 必要 | - |
| /meetings | GET | 商談一覧取得 | 必要 | admin または self |
| /meetings/:id | GET | 商談詳細取得 | 必要 | admin または self |

## 4. Supabase DB直接アクセス

### 4.1 RLSポリシー概要

| テーブル | ポリシー | 対象ユーザー | 対象操作 |
|---------|---------|------------|---------|
| profiles | 自分のデータのみ | すべてのユーザー | SELECT, UPDATE |
| exhibitions | 公開展示会 | すべてのユーザー | SELECT |
| exhibitions | すべての展示会 | 管理者 | SELECT, INSERT, UPDATE, DELETE |
| meetings | 自分の商談のみ | クライアント | SELECT, INSERT, UPDATE |
| meetings | すべての商談 | 管理者 | SELECT, INSERT, UPDATE, DELETE |
| clients | 自分のデータのみ | クライアント | SELECT, UPDATE |
| clients | すべてのクライアント | 管理者 | SELECT, INSERT, UPDATE, DELETE |

### 4.2 フロントエンドからのDB直接アクセス

以下のようなパターンでデータ取得を行う:

```typescript
// Supabaseクライアントを初期化
const supabase = createClient();

// 自分のプロファイル情報を取得
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', session.user.id)
  .single();

// 公開展示会一覧を取得
const { data, error } = await supabase
  .from('exhibitions')
  .select('*')
  .eq('is_public', true);

// 自分の商談一覧を取得
const { data, error } = await supabase
  .from('meetings')
  .select('*')
  .eq('client_id', session.user.id);
```

## 5. ハイブリッドアクセスパターン

以下の機能については、バックエンドAPIとSupabase DB直接アクセスの両方を実装し、可用性を向上させています:

- ユーザープロファイル取得・更新
- 展示会一覧・詳細取得
- 商談一覧・詳細取得

なお、優先順位は次の通りです:
1. Supabase DB直接アクセス（レイテンシが低い）
2. バックエンドAPI（複雑なビジネスロジックが必要な場合）

## 6. パフォーマンス比較

両アクセス方法のパフォーマンス測定結果は以下のとおりです:

| アクセス方法 | 平均レスポンス時間 | 備考 |
|------------|-----------------|------|
| Supabase DB直接アクセス | 約50-100ms | シンプルなデータ取得に最適 |
| バックエンドAPI | 約100-200ms | 複雑な処理が必要な場合に使用 |

## 7. エラー処理ガイドライン

フロントエンドでの主要なエラー処理パターン:

1. 認証エラー (401): ログインページへリダイレクト
2. 権限エラー (403): エラーメッセージ表示、該当機能を非表示
3. バリデーションエラー (400): フォームフィールドにエラー表示
4. サーバーエラー (500): 汎用エラーメッセージ表示、リトライオプション提供
5. ネットワークエラー: オフライン状態を検出し、適切なメッセージ表示