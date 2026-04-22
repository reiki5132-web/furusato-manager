import { useState } from 'react';
import type { AppData, Donation, UserId } from '../types';
import { getUserList } from '../store';
import DonationForm from './DonationForm';

interface Props {
  data: AppData;
  year: number;
  onAdd: (d: Omit<Donation, 'id'>) => void;
  onUpdate: (d: Donation) => void;
  onDelete: (id: string) => void;
}

const TAX_LABELS = { onestop: 'ワンストップ', kakutei: '確定申告' };

export default function DonationList({ data, year, onAdd, onUpdate, onDelete }: Props) {
  const [filterUser, setFilterUser] = useState<UserId | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const users = getUserList(data);
  const allDonations = data.donations
    .filter(d => d.year === year)
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = filterUser === 'all' ? allDonations : allDonations.filter(d => d.userId === filterUser);
  const total = filtered.reduce((s, d) => s + d.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm('この寄付記録を削除しますか？')) onDelete(id);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4 pt-2">
        <div>
          <h1 className="font-mincho text-2xl font-bold text-[#0c0a09] wa-dot">寄付記録</h1>
          <p className="text-xs text-[#78716c] mt-1 ml-4">{year}年</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          ＋ 追加
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-[#e7e5e4] rounded p-4 mb-4">
          <h2 className="font-mincho font-bold text-[#0c0a09] mb-4">新規寄付を追加</h2>
          <DonationForm
            users={users}
            year={year}
            onSave={(d) => { onAdd(d); setShowAddForm(false); }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilterUser('all')}
          className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
            filterUser === 'all'
              ? 'bg-[#0c0a09] text-white font-semibold'
              : 'bg-white text-[#0c0a09] border border-[#e7e5e4]'
          }`}
        >
          全員
        </button>
        {users.map(u => (
          <button
            key={u.id}
            onClick={() => setFilterUser(u.id)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              filterUser === u.id
                ? 'bg-[#0c0a09] text-white font-semibold'
                : 'bg-white text-[#0c0a09] border border-[#e7e5e4]'
            }`}
          >
            {u.name}
          </button>
        ))}
      </div>

      {/* 合計サマリー */}
      {filtered.length > 0 && (
        <div className="bg-white border border-[#e7e5e4] rounded relative overflow-hidden mb-4">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-[#b91c1c]" />
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-[11px] text-[#78716c]">合計</p>
              <p className="font-mincho text-xl font-bold text-[#0c0a09]">¥{total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#78716c]">件数</p>
              <p className="font-mincho text-xl font-bold text-[#0c0a09]">{filtered.length}件</p>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e7e5e4] rounded p-10 text-center text-[#78716c]">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">寄付記録がありません</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(donation => (
            <div key={donation.id} className="bg-white border border-[#e7e5e4] rounded p-4">
              {editingId === donation.id ? (
                <>
                  <h3 className="font-mincho font-bold text-[#0c0a09] mb-3">寄付を編集</h3>
                  <DonationForm
                    users={users}
                    initialData={donation}
                    year={year}
                    onSave={(d) => { onUpdate({ ...d, id: donation.id }); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#b91c1c] font-semibold tracking-wider">
                      {donation.date.replace(/-/g, '.')}
                    </p>
                    <p className="font-mincho font-bold text-[#0c0a09] truncate mt-1">{donation.municipalityName}</p>
                    {donation.returnGiftName && (
                      <p className="text-xs text-[#78716c] truncate mt-0.5">{donation.returnGiftName}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[10px] bg-[#fafaf9] border border-[#e7e5e4] text-[#0c0a09] px-2 py-0.5 rounded">
                        {data.users[donation.userId]?.name ?? '?'}
                      </span>
                      <span className="text-[10px] bg-[#fafaf9] border border-[#e7e5e4] text-[#78716c] px-2 py-0.5 rounded">
                        {TAX_LABELS[donation.taxMethod]}
                      </span>
                      {donation.receiptReceived && (
                        <span className="text-[10px] bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] px-2 py-0.5 rounded">受領証✓</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="font-mincho text-lg font-bold text-[#0c0a09]">
                      ¥{donation.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-1 mt-1 justify-end">
                      <button
                        onClick={() => setEditingId(donation.id)}
                        className="text-[#78716c] hover:text-[#0c0a09] p-1 text-xs"
                        title="編集"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(donation.id)}
                        className="text-[#78716c] hover:text-[#b91c1c] p-1 text-xs"
                        title="削除"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
