"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';
import { useToast } from '../hooks/use-toast';

// ユーザータイプの定義
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  companyId?: string;
  companyName?: string;
  [key: string]: any;
}

// 認証コンテキストの状態タイプ
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: any; token: string }>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// コンテキストプロバイダーのプロパティ型
interface AuthProviderProps {
  children: ReactNode;
}

// 認証コンテキストプロバイダー
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // ログイン状態の確認
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const { user } = await authAPI.getProfile();
        setUser(user);
      } catch (err) {
        // 認証エラーの場合はサイレントに処理
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);
      const { user, token } = response;
      setUser(user);

      // ユーザーロール情報をCookieに設定
      document.cookie = `user_role=${user.role}; path=/; max-age=86400`; // 24時間有効

      // 認証トークンも明示的に設定
      document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24時間有効

      console.log("認証情報をCookieに設定:", { role: user.role, tokenExists: !!token });

      toast({
        title: 'ログインしました',
        description: `${user.name}さん、ようこそ！`,
      });
      return response; // レスポンスを返す
    } catch (err) {
      setError(err instanceof Error ? err : new Error('ログインに失敗しました'));
      toast({
        title: 'ログインエラー',
        description: err instanceof Error ? err.message : 'メールアドレスまたはパスワードが正しくありません',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 新規登録関数
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await authAPI.register(userData);
      setUser(user);
      toast({
        title: 'アカウント登録完了',
        description: 'アカウントが正常に作成されました',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('登録に失敗しました'));
      toast({
        title: '登録エラー',
        description: err instanceof Error ? err.message : 'アカウント登録中にエラーが発生しました',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト関数
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authAPI.logout();
      setUser(null);

      // Cookie情報をクリア
      document.cookie = "user_role=; path=/; max-age=0";
      document.cookie = "auth_token=; path=/; max-age=0";

      toast({
        title: 'ログアウトしました',
        description: 'またのご利用をお待ちしております',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('ログアウトに失敗しました'));
      toast({
        title: 'ログアウトエラー',
        description: err instanceof Error ? err.message : 'ログアウト処理中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // プロファイル更新関数
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: updatedUser } = await authAPI.updateProfile(userData);
      setUser(updatedUser);
      toast({
        title: 'プロファイル更新完了',
        description: 'プロファイル情報が更新されました',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('プロファイル更新に失敗しました'));
      toast({
        title: 'プロファイル更新エラー',
        description: err instanceof Error ? err.message : 'プロファイル更新中にエラーが発生しました',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // コンテキスト値の作成
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 認証コンテキストを使用するためのカスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}