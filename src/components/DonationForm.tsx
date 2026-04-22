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

const inputCls = 'w-full border border-[#e7e5e4] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#b91c1c]';

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
    giftStatus: initialData?.giftStatus ?? 'unsent',
    giftScheduledMonth: initialData?.giftScheduledMonth ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.municipalityName || form.amount <= 0) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">寄付者</label>
        <div className="flex gap-2">
          {(['rino', 'haha'] as UserId[]).map(uid => (
            <button
              key={uid}
              type="button"
              onClick={() => setForm({ ...form, userId: uid })}
              className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
                form.userId === uid
                  ? 'bg-[#0c0a09] text-white'
                  : 'bg-white border border-[#e7e5e4] text-[#0c0a09]'
              }`}
            >
              {uid === 'rino' ? 'りの' : '母'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">日付</label>
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value, year: new Date(e.target.value).getFullYear() })}
          className={inputCls}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">自治体名</label>
        <input
          type="text"
          value={form.municipalityName}
          onChange={e => setForm({ ...form, municipalityName: e.target.value })}
          placeholder="例：北海道 上士幌町"
          className="w-full border border-[#b91c1c] rounded px-3 py-2 text-sm bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">寄付金額（円）</label>
        <input
          type="number"
          value={form.amount || ''}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
          placeholder="10000"
          min={1}
          className="w-full border border-[#e7e5e4] rounded px-3 py-2 font-mincho text-lg font-bold bg-white focus:outline-none focus:border-[#b91c1c]"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">返礼品名</label>
        <input
          type="text"
          value={form.returnGiftName}
          onChange={e => setForm({ ...form, returnGiftName: e.target.value })}
          placeholder="例：いくら醤油漬け"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">カテゴリ</label>
        <select
          value={form.returnGiftCategory}
          onChange={e => setForm({ ...form, returnGiftCategory: e.target.value })}
          className={inputCls}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#78716c] mb-1.5">申請方法</label>
        <select
          value={form.taxMethod}
          onChange={e => setForm({ ...form, taxMethod: e.target.value as 'onestop' | 'kakutei' })}
          className={inputCls}
        >
          <option value="onestop">ワンストップ特例</option>
          <option value="kakutei">確定申告</option>
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm text-[#0c0a09] cursor-pointer">
          <input
            type="checkbox"
            checked={form.receiptReceived}
            onChange={e => setForm({ ...form, receiptReceived: e.target.checked })}
            className="w-4 h-4 accent-[#b91c1c]"
          />
          寄付金受領証を受け取った
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold py-3 rounded transition-colors"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-[#0c0a09] hover:bg-black text-white font-semibold py-3 rounded transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
