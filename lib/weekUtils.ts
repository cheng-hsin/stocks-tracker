// 週次計算工具函數
// 基準：2026/01/15 為第1週

const BASE_DATE = new Date('2026-01-15');
const BASE_WEEK = 1;

export function calculateWeek(dateString: string): number {
  const inputDate = new Date(dateString);
  const diffTime = inputDate.getTime() - BASE_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  
  return BASE_WEEK + diffWeeks;
}