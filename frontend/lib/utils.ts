import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日付をフォーマットする関数
 * @param dateString - 日付文字列またはDate型
 * @param options - Intl.DateTimeFormatのオプション
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

/**
 * 時刻をフォーマットする関数
 * @param timeString - 時刻文字列または日付オブジェクト
 * @returns フォーマットされた時刻文字列
 */
export function formatTime(timeString: string | Date): string {
  const date = typeof timeString === 'string'
    ? (timeString.includes(':') ? new Date(`1970-01-01T${timeString}`) : new Date(timeString))
    : timeString;

  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * 日付と時刻を組み合わせてDateオブジェクトを作成する関数
 * @param dateString - 日付文字列
 * @param timeString - 時刻文字列
 * @returns Dateオブジェクト
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  const date = new Date(dateString);
  const [hours, minutes] = timeString.split(':').map(Number);

  date.setHours(hours);
  date.setMinutes(minutes);

  return date;
}
