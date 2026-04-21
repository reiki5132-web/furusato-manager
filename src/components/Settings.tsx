import { useState } from 'react';
import type { AppData, UserId, UserProfile } from '../types';

interface Props {
  data: AppData;
  onUpdate: (profile: UserProfile) => void;
}

const INCOME_BRACKETS = [
  { label: '〜300万円', value: 300 },
  { label: '300〜400万円', value: 350 },
  { label: '400〜500万円', value: 450 },
  { label: '500〜600万円', value: 550 },
  { label: '600〜700万円', value: 650 },
  { label: '700〜800万円', value: 750 },
  { label: '800〜900万円', value: 850 },
  { label: '900〜1000万円', value: 950 },
  { label: '1000〜1200万円', value: 1100 },
  { label: '1200万円〜', value: 1300 },
];

const FAMILY_TYPES = [
  { label: '独身 / 共働き', key: 'single', values: [28000, 38000, 46000, 57000, 69000, 79000, 89000, 99000, 119000, 152000] },
  { label: '夫婦（配偶者控除あり）', key: 'couple', values: [19000, 26000, 33000, 42000, 49000, 60000, 66000, 76000, 93000, 126000] },
  { label: '夫婦＋子1人', key: 'child1', values: [19000, 26000, 33000, 38000, 49000, 60000, 66000, 76000, 93000, 114000] },
  { label: '夫婦＋子2人', key: 'child2', values: [15000, 22000, 28000, 33000, 42000, 54000, 60000, 70000, 85000, 108000] },
];

function UserSettings({ user, onUpdate }: { user: UserProfile; onUpdate: (p: UserProfile) => void }) {
  const [manual, setManual] = useState(String(user.limitAmount || ''));
  const [incomeIdx, setIncomeIdx] = useState(0);
  const [familyKey, setFamilyKey] = useState('single');
  const [mode, setMode] = useState<'manual' | 'calc'>('manual');

  const calcLimit = () => {
    const family = FAMILY_TYPES.find(f => f.key === familyKey);
    return family ? family.values[incomeIdx] : 0;
  };

  const handleSave = () => {
    const amount = mode === 'manual' ? Number(manual) : calcLimit();
    if (amount > 0) onUpdate({ ...user, limitAmount: amount });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="font-bold text-gray-800 mb-4">{user.name} の設定</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
            mode === 'manual' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          手動入力
        </button>
        <button
          onClick={() => setMode('calc')}
          className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
            mode === 'calc' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          簡易計算
        </button>
      </div>

      {mode === 'manual' ? (
        <div>
          <label className="block text-sm text-gray-600 mb-1 whitespace-nowrap">年間控除上限額（円）</label>
          <input
            type="number"
            value={manual}
            onChange={e => setManual(e.target.value)}
            placeholder="例：50000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3"
            style={{ fontSize: '16px' }}
          />
        </div>
      ) : (
        <div className="space-y-3 mb-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">年収</label>
            <select
              value={incomeIdx}
              onChange={e => setIncomeIdx(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {INCOME_BRACKETS.map((b, i) => (
                <option key={i} value={i}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">家族構成</label>
            <select
              value={familyKey}
              onChange={e => setFamilyKey(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {FAMILY_TYPES.map(f => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">概算上限額</p>
            <p className="text-2xl font-bold text-orange-600">¥{calcLimit().toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">※ 目安です。正確な額はシミュレーションサイトでご確認ください</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {user.limitAmount > 0 && (
          <span className="text-xs text-gray-400">現在: ¥{user.limitAmount.toLocaleString()}</span>
        )}
        <button
          onClick={handleSave}
          className="ml-auto bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  );
}

export default function Settings({ data, onUpdate }: Props) {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-700 mb-4">設定</h1>
      <div className="space-y-4">
        {(['rino', 'haha'] as UserId[]).map(uid => (
          <UserSettings key={uid} user={data.users[uid]} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
