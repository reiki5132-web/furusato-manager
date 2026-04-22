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
    <div>
      {/* 見出し：明朝・大きめ・朱印ドット */}
      <div className="flex items-baseline mb-2 px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] mr-2 self-center" />
        <span className="font-mincho text-xl font-bold text-[#0c0a09]">{user.name}</span>
        <span className="text-xs text-[#78716c] ml-2">の設定</span>
      </div>

      <div className="bg-white border border-[#e7e5e4] rounded relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#b91c1c]" />
        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 text-sm py-2 rounded font-semibold transition-colors ${
                mode === 'manual' ? 'bg-[#0c0a09] text-white' : 'bg-[#fafaf9] border border-[#e7e5e4] text-[#78716c]'
              }`}
            >
              手動入力
            </button>
            <button
              onClick={() => setMode('calc')}
              className={`flex-1 text-sm py-2 rounded font-semibold transition-colors ${
                mode === 'calc' ? 'bg-[#0c0a09] text-white' : 'bg-[#fafaf9] border border-[#e7e5e4] text-[#78716c]'
              }`}
            >
              簡易計算
            </button>
          </div>

          {mode === 'manual' ? (
            <div>
              <label className="block text-xs text-[#78716c] mb-1.5">年間控除上限額（円）</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={manual}
                  onChange={e => setManual(e.target.value)}
                  placeholder="例：50000"
                  className="flex-1 border border-[#b91c1c] rounded px-3 py-2 font-mincho text-[#0c0a09] focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold px-5 rounded transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#78716c] mb-1.5">年収</label>
                <select
                  value={incomeIdx}
                  onChange={e => setIncomeIdx(Number(e.target.value))}
                  className="w-full border border-[#e7e5e4] rounded px-3 py-2 text-sm bg-white"
                >
                  {INCOME_BRACKETS.map((b, i) => (
                    <option key={i} value={i}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#78716c] mb-1.5">家族構成</label>
                <select
                  value={familyKey}
                  onChange={e => setFamilyKey(e.target.value)}
                  className="w-full border border-[#e7e5e4] rounded px-3 py-2 text-sm bg-white"
                >
                  {FAMILY_TYPES.map(f => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded p-3 text-center">
                <p className="text-xs text-[#78716c] mb-1">概算上限額</p>
                <p className="font-mincho text-2xl font-bold text-[#b91c1c]">¥{calcLimit().toLocaleString()}</p>
                <p className="text-[10px] text-[#78716c] mt-1">※ 目安です。正確な額はシミュレーションサイトでご確認ください</p>
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-semibold py-2.5 rounded transition-colors"
              >
                保存
              </button>
            </div>
          )}

          {user.limitAmount > 0 && (
            <p className="text-xs text-[#78716c] mt-3">現在：¥{user.limitAmount.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Settings({ data, onUpdate }: Props) {
  return (
    <div>
      <div className="mb-5 pt-2">
        <h1 className="font-mincho text-2xl font-bold text-[#0c0a09] wa-dot">設定</h1>
      </div>
      <div className="space-y-5">
        {(['rino', 'haha'] as UserId[]).map(uid => (
          <UserSettings key={uid} user={data.users[uid]} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
