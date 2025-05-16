"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { meetingAPI } from '@/lib/api';
import ClientLayout from '@/components/client-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EditMeetingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { id } = params;

  const [formData, setFormData] = useState({
    meetingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    notes: '',
  });

  const [originalData, setOriginalData] = useState({
    exhibitionId: '',
    exhibitionName: '',
    status: '',
  });

  // 商談詳細情報を取得
  useEffect(() => {
    const fetchMeetingDetail = async () => {
      try {
        setIsLoading(true);
        const response = await meetingAPI.getById(id);
        const meeting = response.meeting;

        // 読み取り専用データを保存
        setOriginalData({
          exhibitionId: meeting.exhibitionId,
          exhibitionName: meeting.exhibitionName,
          status: meeting.status,
        });

        // 編集可能なデータをフォームにセット
        setFormData({
          meetingDate: meeting.date,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          purpose: meeting.purpose || '',
          notes: meeting.notes || '',
        });
      } catch (error) {
        console.error("商談詳細の取得に失敗しました:", error);
        toast({
          title: "エラーが発生しました",
          description: "商談情報の取得に失敗しました。",
          variant: "destructive",
        });
        router.push("/client/meetings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingDetail();
  }, [id, router, toast]);

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

  // バリデーション機能
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.meetingDate) {
      newErrors.meetingDate = '商談希望日を入力してください';
    } else {
      const meetingDate = new Date(formData.meetingDate);
      meetingDate.setHours(0, 0, 0, 0);

      if (meetingDate < today) {
        newErrors.meetingDate = '過去の日付は選択できません';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // キャンセル済みの場合は編集不可
    if (originalData.status === 'canceled') {
      toast({
        title: '編集できません',
        description: 'キャンセル済みの商談は編集できません',
        variant: 'destructive',
      });
      return;
    }

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
        exhibitionId: originalData.exhibitionId,
        scheduledAt,
        endAt,
        purpose: formData.purpose,
        notes: formData.notes,
      };

      await meetingAPI.update(id, meetingData);
      toast({
        title: '成功',
        description: '商談情報が更新されました',
      });
      router.push(`/client/meetings/${id}`);
    } catch (error) {
      console.error('商談情報の更新に失敗しました:', error);
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
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.push(`/client/meetings/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold">商談情報編集</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">読み込み中...</span>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{originalData.exhibitionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    disabled={originalData.status === 'canceled'}
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
                      disabled={originalData.status === 'canceled'}
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
                      disabled={originalData.status === 'canceled'}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-destructive">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className={errors.purpose ? "text-destructive" : ""}>
                    商談目的 *
                  </Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className={errors.purpose ? "border-destructive" : ""}
                    placeholder="商談の目的や討議したい内容を記入してください"
                    rows={4}
                    disabled={originalData.status === 'canceled'}
                  />
                  {errors.purpose && (
                    <p className="text-sm text-destructive">{errors.purpose}</p>
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
                    disabled={originalData.status === 'canceled'}
                  />
                </div>

                {originalData.status === 'canceled' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      キャンセル済みの商談は編集できません。
                    </AlertDescription>
                  </Alert>
                )}

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
                    onClick={() => router.push(`/client/meetings/${id}`)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || originalData.status === 'canceled'}
                  >
                    {isSubmitting ? '更新中...' : '更新する'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}