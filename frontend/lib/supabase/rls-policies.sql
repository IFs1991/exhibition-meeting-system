-- RLS (Row Level Security) ポリシーの定義
-- このSQLは、Supabaseのダッシュボードの「SQL Editor」で実行することを想定しています。

-- STEP 1: テーブルのRLSを有効化
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exhibitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meetings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;

-- STEP 2: profilesテーブルのポリシーを定義
-- ユーザーは自分自身のプロファイル情報のみ参照可能
CREATE POLICY "Users can view their own profile"
  ON "profiles" FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分自身のプロファイル情報のみ更新可能
CREATE POLICY "Users can update their own profile"
  ON "profiles" FOR UPDATE
  USING (auth.uid() = id);

-- STEP 3: exhibitionsテーブルのポリシーを定義
-- 管理者は全ての展示会を参照・作成・更新・削除可能
CREATE POLICY "Admins have full access to exhibitions"
  ON "exhibitions" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- 一般ユーザーはisPublicがtrueの展示会のみ参照可能
CREATE POLICY "Public exhibitions are viewable by all users"
  ON "exhibitions" FOR SELECT
  USING (is_public = true);

-- STEP 4: meetingsテーブルのポリシーを定義
-- 管理者は全ての商談を参照・作成・更新・削除可能
CREATE POLICY "Admins have full access to meetings"
  ON "meetings" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- ユーザーは自分が関連する商談のみ参照可能
CREATE POLICY "Users can view their own meetings"
  ON "meetings" FOR SELECT
  USING (client_id = auth.uid());

-- ユーザーは自分が関連する商談のみ作成可能
CREATE POLICY "Users can create their own meetings"
  ON "meetings" FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- ユーザーは自分が関連する商談のみ更新可能
CREATE POLICY "Users can update their own meetings"
  ON "meetings" FOR UPDATE
  USING (client_id = auth.uid());

-- STEP 5: clientsテーブルのポリシーを定義
-- 管理者は全てのクライアント情報を参照・作成・更新・削除可能
CREATE POLICY "Admins have full access to clients"
  ON "clients" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- ユーザーは自分自身のクライアント情報のみ参照可能
CREATE POLICY "Users can view their own client info"
  ON "clients" FOR SELECT
  USING (id = auth.uid());

-- ユーザーは自分自身のクライアント情報のみ更新可能
CREATE POLICY "Users can update their own client info"
  ON "clients" FOR UPDATE
  USING (id = auth.uid());