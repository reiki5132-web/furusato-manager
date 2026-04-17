import { useState } from 'react';
import type { AppData, Donation, UserId } from '../types';
import { getDonationsByUser } from '../store';
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

  const allDonations = [...getDonationsByUser(data, 'rino', year), ...getDonationsByUser(data, 'haha', year)]
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = filterUser === 'all' ? allDonations : allDonations.filter(d => d.userId === filterUser);

  const handleDelete = (id: string) => {
    if (confirm('この寄付記録を削除しますか？')) onDelete(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-700">寄付記録 {year}年</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          ＋ 追加
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow p-5 mb-4">
          <h2 className="font-bold text-gray-700 mb-4">新規寄付を追加</h2>
          <DonationForm
            year={year}
            onSave={(d) => { onAdd(d); setShowAddForm(false); }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['all', 'rino', 'haha'] as const).map(uid => (
          <button
            key={uid}
            onClick={() => setFilterUser(uid)}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              filterUser === uid
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {uid === 'all' ? '全員' : data.users[uid].name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">寄付記録がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(donation => (
            <div key={donation.id} className="bg-white rounded-2xl shadow p-4">
              {editingId === donation.id ? (
                <>
                  <h3 className="font-bold text-gray-700 mb-3">寄付を編集</h3>
                  <DonationForm
                    initialData={donation}
                    year={year}
                    onSave={(d) => { onUpdate({ ...d, id: donation.id }); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                </>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          donation.userId === 'rino'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {data.users[donation.userId].name}
                        </span>
                        <span className="text-xs text-gray-400">{donation.date}</span>
                      </div>
                      <p className="font-semibold text-gray-800 truncate">{donation.municipalityName}</p>
                      {donation.returnGiftName && (
                        <p className="text-sm text-gray-500 truncate">{donation.returnGiftName}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-orange-600">¥{donation.amount.toLocaleString()}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          {TAX_LABELS[donation.taxMethod]}
                        </span>
                        {donation.receiptReceived && (
                          <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">受領証✓</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => setEditingId(donation.id)}
                        className="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="編集"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(donation.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="削除"
                      >
                        🗑️
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
