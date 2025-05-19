"use client";

import { createClient } from './client';

/**
 * RLSポリシーのテスト用ユーティリティ
 * これらの関数は開発・テスト環境でのみ使用します
 */

/**
 * プロファイルへのアクセスをテスト
 * 自分のプロファイルと他人のプロファイルの両方へのアクセスをテスト
 */
export async function testProfilesAccess() {
  const supabase = createClient();
  const results = {
    selfProfileRead: null as any,
    selfProfileReadError: null as Error | null,
    otherProfileRead: null as any,
    otherProfileReadError: null as Error | null,
  };

  try {
    // 自分のプロファイルを読み取り
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('認証されていません');
    }

    const { data: selfProfile, error: selfProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    results.selfProfileRead = selfProfile;
    results.selfProfileReadError = selfProfileError;

    // 他のプロファイルを読み取り (RLSにより制限されるはず)
    const { data: otherProfiles, error: otherProfileError } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', session.user.id)
      .limit(1)
      .single();

    results.otherProfileRead = otherProfiles;
    results.otherProfileReadError = otherProfileError;
  } catch (error) {
    console.error('テスト実行エラー:', error);
  }

  return results;
}

/**
 * 展示会へのアクセスをテスト
 * 公開展示会と非公開展示会へのアクセスをテスト
 */
export async function testExhibitionsAccess() {
  const supabase = createClient();
  const results = {
    publicExhibitionsRead: null as any,
    publicExhibitionsError: null as Error | null,
    privateExhibitionsRead: null as any,
    privateExhibitionsError: null as Error | null,
  };

  try {
    // 公開展示会を読み取り
    const { data: publicExhibitions, error: publicExhibitionsError } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('is_public', true)
      .limit(5);

    results.publicExhibitionsRead = publicExhibitions;
    results.publicExhibitionsError = publicExhibitionsError;

    // 非公開展示会を読み取り (管理者のみアクセス可能)
    const { data: privateExhibitions, error: privateExhibitionsError } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('is_public', false)
      .limit(5);

    results.privateExhibitionsRead = privateExhibitions;
    results.privateExhibitionsError = privateExhibitionsError;
  } catch (error) {
    console.error('テスト実行エラー:', error);
  }

  return results;
}

/**
 * 商談へのアクセスをテスト
 * 自分の商談と他人の商談へのアクセスをテスト
 */
export async function testMeetingsAccess() {
  const supabase = createClient();
  const results = {
    selfMeetingsRead: null as any,
    selfMeetingsError: null as Error | null,
    otherMeetingsRead: null as any,
    otherMeetingsError: null as Error | null,
  };

  try {
    // 自分のセッション情報を取得
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('認証されていません');
    }

    // 自分の商談を読み取り
    const { data: selfMeetings, error: selfMeetingsError } = await supabase
      .from('meetings')
      .select('*')
      .eq('client_id', session.user.id)
      .limit(5);

    results.selfMeetingsRead = selfMeetings;
    results.selfMeetingsError = selfMeetingsError;

    // 他人の商談を読み取り (RLSにより制限されるはず、管理者は可能)
    const { data: otherMeetings, error: otherMeetingsError } = await supabase
      .from('meetings')
      .select('*')
      .neq('client_id', session.user.id)
      .limit(5);

    results.otherMeetingsRead = otherMeetings;
    results.otherMeetingsError = otherMeetingsError;
  } catch (error) {
    console.error('テスト実行エラー:', error);
  }

  return results;
}

/**
 * 全てのRLSポリシーをテスト
 */
export async function testAllRlsPolicies() {
  const profilesResult = await testProfilesAccess();
  const exhibitionsResult = await testExhibitionsAccess();
  const meetingsResult = await testMeetingsAccess();

  return {
    profiles: profilesResult,
    exhibitions: exhibitionsResult,
    meetings: meetingsResult,
  };
}