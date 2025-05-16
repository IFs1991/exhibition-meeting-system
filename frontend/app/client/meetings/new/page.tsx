"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/use-toast';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { exhibitionAPI, meetingAPI, aiAPI } from '../../../../lib/api';
import ClientLayout from '@/components/client-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewMeetingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExhibitions, setIsLoadingExhibitions] = useState(true);
  const [isGeneratingPurpose, setIsGeneratingPurpose] = useState(false);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [purposeSuggestions, setPurposeSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    exhibitionId: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    notes: '',
  });

  // 展示会一覧を取得
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const { exhibitions } = await exhibitionAPI.getAll({
          limit: 50,
          isPublic: true
        });
        setExhibitions(exhibitions);
      } catch (error) {
        console.error('展示会の取得に失敗しました:', error);
        toast({
          title: 'エラー',
          description: '展示会情報の取得に失敗しました',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingExhibitions(false);
      }
    };

    fetchExhibitions();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // エラーがあれば削除
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // エラーがあれば削除
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // バリデーション機能
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.exhibitionId) {
      newErrors.exhibitionId = '展示会を選択してください';
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = '商談希望日を入力してください';
    } else {
      const meetingDate = new Date(formData.meetingDate);
      meetingDate.setHours(0, 0, 0, 0);

      if (meetingDate < today) {
        newErrors.meetingDate = '過去の日付は選択できません';
      } else {
        // 選択した展示会の開催期間内かチェック
        const selectedExhibition = exhibitions.find(ex => ex.id === formData.exhibitionId);
        if (selectedExhibition) {
          const startDate = new Date(selectedExhibition.startDate);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(selectedExhibition.endDate);
          endDate.setHours(0, 0, 0, 0);

          if (meetingDate < startDate || meetingDate > endDate) {
            newErrors.meetingDate = '選択した展示会の開催期間内で選択してください';
          }
        }
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = '開始時間を入力してください';
    }

    if (!formData.endTime) {
      newErrors.endTime = '終了時間を入力してください';
    } else if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = '終了時間は開始時間より後にしてください';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = '商談目的を入力してください';
    } else if (formData.purpose.length < 10) {
      newErrors.purpose = '商談目的は10文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // AI機能を利用して商談目的の提案を生成
  const generatePurposeSuggestions = async () => {
    if (!formData.exhibitionId) {
      toast({
        title: '展示会を選択してください',
        description: '商談目的の提案には展示会選択が必要です',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPurpose(true);
    try {
      const selectedExhibition = exhibitions.find(ex => ex.id === formData.exhibitionId);

      // リクエストのタイムアウト処理を追加
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト

      const { suggestions } = await aiAPI.generateMeetingPurpose({
        exhibitionInfo: selectedExhibition,
        keywords: ['ビジネスマッチング', '商談', '連携', '業務提携']
      });

      clearTimeout(timeoutId); // タイムアウトクリア

      // 結果が空の場合の処理
      if (!suggestions || suggestions.length === 0) {
        toast({
          title: '提案生成結果がありません',
          description: '別のキーワードや展示会を選択してみてください',
          variant: 'destructive',
        });
        return;
      }

      setPurposeSuggestions(suggestions);

      // 成功通知を表示
      toast({
        title: '商談目的の提案が生成されました',
        description: `${suggestions.length}件の提案が生成されました`,
      });
    } catch (error) {
      console.error('商談目的の生成に失敗しました:', error);

      // エラー種別に応じたメッセージ
      let errorMessage = '商談目的の提案生成に失敗しました';
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = 'リクエストがタイムアウトしました。ネットワーク環境を確認してください';
      } else if (error instanceof Error) {
        // APIからのエラーメッセージがある場合はそれを表示
        errorMessage = error.message || errorMessage;
      }

      toast({
        title: 'エラー',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPurpose(false);
    }
  };

  // 提案された商談目的を選択
  const selectPurposeSuggestion = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, purpose: suggestion }));

    // エラーがあれば削除
    if (errors.purpose) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.purpose;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // フォームバリデーション
    if (!validateForm()) {
      toast({
        title: '入力エラー',
        description: '入力内容を確認してください',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 開始時間と終了時間をISO形式に変換
      const scheduledAt = `${formData.meetingDate}T${formData.startTime}:00`;
      const endAt = `${formData.meetingDate}T${formData.endTime}:00`;

      const meetingData = {
        exhibitionId: formData.exhibitionId,
        scheduledAt,
        endAt,
        purpose: formData.purpose,
        notes: formData.notes,
      };

      await meetingAPI.create(meetingData);
      toast({
        title: '成功',
        description: '商談予約が正常に登録されました',
      });
      router.push('/client/meetings');
    } catch (error) {
      console.error('商談予約の登録に失敗しました:', error);
      toast({
        title: 'エラー',
        description: 'エラーが発生しました。もう一度お試しください。',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">商談予約登録</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/client/meetings')}
          >
            予約一覧に戻る
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>商談情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="exhibitionId" className={errors.exhibitionId ? "text-destructive" : ""}>
                  展示会 *
                </Label>
                {isLoadingExhibitions ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>読み込み中...</span>
                  </div>
                ) : (
                  <Select
                    value={formData.exhibitionId}
                    onValueChange={(value) => handleSelectChange('exhibitionId', value)}
                  >
                    <SelectTrigger className={errors.exhibitionId ? "border-destructive" : ""}>
                      <SelectValue placeholder="展示会を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {exhibitions.map((exhibition) => (
                        <SelectItem key={exhibition.id} value={exhibition.id}>
                          {exhibition.name} ({new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.exhibitionId && (
                  <p className="text-sm text-destructive">{errors.exhibitionId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingDate" className={errors.meetingDate ? "text-destructive" : ""}>
                  商談希望日 *
                </Label>
                <Input
                  id="meetingDate"
                  name="meetingDate"
                  type="date"
                  value={formData.meetingDate}
                  onChange={handleChange}
                  className={errors.meetingDate ? "border-destructive" : ""}
                />
                {errors.meetingDate && (
                  <p className="text-sm text-destructive">{errors.meetingDate}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className={errors.startTime ? "text-destructive" : ""}>
                    開始時間 *
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={errors.startTime ? "border-destructive" : ""}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-destructive">{errors.startTime}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className={errors.endTime ? "text-destructive" : ""}>
                    終了時間 *
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={errors.endTime ? "border-destructive" : ""}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="purpose" className={errors.purpose ? "text-destructive" : ""}>
                    商談目的 *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePurposeSuggestions}
                    disabled={isGeneratingPurpose || !formData.exhibitionId}
                  >
                    {isGeneratingPurpose ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        AIに提案を求める
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={errors.purpose ? "border-destructive" : ""}
                  placeholder="商談の目的や討議したい内容を記入してください"
                  rows={4}
                />
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose}</p>
                )}

                {purposeSuggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">AIからの提案:</p>
                    <div className="space-y-2">
                      {purposeSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted rounded-md text-sm cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => selectPurposeSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備考</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="その他の要望や質問などがあれば記入してください"
                  rows={3}
                />
              </div>

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    入力内容に問題があります。エラーメッセージを確認してください。
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/client/meetings')}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '登録中...' : '予約する'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
