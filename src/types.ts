export type UserId = string;

export interface UserProfile {
  id: UserId;
  name: string;
  limitAmount: number; // 年間控除上限額
}

export type GiftStatus = 'unsent' | 'shipped' | 'received';

export interface Donation {
  id: string;
  userId: UserId;
  date: string; // YYYY-MM-DD
  municipalityName: string; // 自治体名
  amount: number; // 寄付金額
  returnGiftName: string; // 返礼品名
  returnGiftCategory: string; // カテゴリ
  taxMethod: 'onestop' | 'kakutei'; // ワンストップ or 確定申告
  receiptReceived: boolean; // 受領証受取
  year: number;
  giftStatus: GiftStatus; // 返礼品配送ステータス
  giftScheduledMonth: string; // 受取予定時期メモ
}

export interface AppData {
  users: Record<UserId, UserProfile>;
  donations: Donation[];
}
