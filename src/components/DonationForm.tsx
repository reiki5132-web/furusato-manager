import { useState } from 'react';
import type { Donation, UserId } from '../types';

interface Props {
  initialData?: Donation;
  defaultUserId?: UserId;
  year: number;
  onSave: (donation: Omit<Donation, 'id'>) => void;
  onCancel: () => void;
}

const CATEGORIES = ['食品・飲料', '日用品', '家電', '工芸品', 'アウトドア', 'その他'];

export default function DonationForm({ initialData, defaultUserId = 'rino', year, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Donation, 'id'>>({
    userId: initialData?.userId ?? defaultUserId,
    date: initialData?.date ?? `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    municipalityName: initialData?.municipalityName ?? '',
    amount: initialData?.amount ?? 0,
    returnGiftName: initialData?.returnGiftName ?? '',
    returnGiftCategory: initialData?.returnGiftCategory ?? 'その他',
    taxMethod: initialData?.taxMethod ?? 'onestop',
    receiptReceived: initialData?.receiptReceived ?? false,
    year: initialData?.year ?? year,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.municipalityName || form.amount <= 0) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="w-24 shrink-0">
          <label className="block text-sm text-gray-600 mb-1">ユーザー</label>
          <select
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value as UserId })}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
          >
            <option value="rino">りの</option>
            <option value="haha">母</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">寄付日</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value, year: new Date(e.target.value).getFullYear() })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">自治体名</label>
        <input
          type="text"
          value={form.municipalityName}
          onChange={e => setForm({ ...form, municipalityName: e.target.value })}
          placeholder="例：北海道 上士幌町"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">寄付金額（円）</label>
        <input
          type="number"
          value={form.amount || ''}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
          placeholder="10000"
          min={1}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">返礼品名</label>
        <input
          type="text"
          value={form.returnGiftName}
          onChange={e => setForm({ ...form, returnGiftName: e.target.value })}
          placeholder="例：いくら醤油漬け"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">カテゴリ</label>
        <select
          value={form.returnGiftCategory}
          onChange={e => setForm({ ...form, returnGiftCategory: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">申請方法</label>
        <select
          value={form.taxMethod}
          onChange={e => setForm({ ...form, taxMethod: e.target.value as 'onestop' | 'kakutei' })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="onestop">ワンストップ特例</option>
          <option value="kakutei">確定申告</option>
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.receiptReceived}
            onChange={e => setForm({ ...form, receiptReceived: e.target.checked })}
            className="w-4 h-4"
          />
          寄付金受領証を受け取った
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
