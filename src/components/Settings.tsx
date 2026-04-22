import { useState } from 'react';
import type { AppData, UserProfile } from '../types';
import { getUserList } from '../store';

interface Props {
  data: AppData;
  onUpdate: (profile: UserProfile) => void;
  onAddUser: (name: string) => void;
  onDeleteUser: (id: string) => void;
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

function UserSettings({
  user,
  onUpdate,
  onDelete,
  canDelete,
}: {
  user: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const [manual, setManual] = useState(String(user.limitAmount || ''));
  const [incomeIdx, setIncomeIdx] = useState(0);
  const [familyKey, setFamilyKey] = useState('single');
  const [mode, setMode] = useState<'manual' | 'calc'>('manual');
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);

  const calcLimit = () => {
    const family = FAMILY_TYPES.find(f => f.key === familyKey);
    return family ? family.values[incomeIdx] : 0;
  };

  const handleSave = () => {
    const amount = mode === 'manual' ? Number(manual) : calcLimit();
    if (amount > 0) onUpdate({ ...user, limitAmount: amount });
  };

  const handleNameSave = () => {
    const name = nameDraft.trim();
    if (name && name !== user.name) onUpdate({ ...user, name });
    setEditingName(false);
  };

  return (
    <div>
      {/* 見出し：明朝・大きめ・朱印ドット（名前編集可） */}
      <div className="flex items-center mb-2 px-1 gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] shrink-0" />
        {editingName ? (
          <>
            <input
              type="text"
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={e => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') { setNameDraft(user.name); setEditingName(false); }
              }}
              autoFocus
              className="font-mincho text-xl font-bold text-[#0c0a09] border-b border-[#b91c1c] bg-transparent px-1 flex-1 focus:outline-none"
            />
          </>
        ) : (
          <>
            <span className="font-mincho text-xl font-bold text-[#0c0a09]">{user.name}</span>
            <span className="text-xs text-[#78716c]">の設定</span>
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => { setNameDraft(user.name); setEditingName(true); }}
                className="text-xs text-[#78716c] hover:text-[#0c0a09] px-2 py-1"
                title="名前を変更"
              >
                名前変更
              </button>
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="text-xs text-[#78716c] hover:text-[#b91c1c] px-2 py-1"
                  title="削除"
                >
                  削除
                </button>
              )}
            </div>
          </>
        )}
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

export default function Settings({ data, onUpdate, onAddUser, onDeleteUser }: Props) {
  const users = getUserList(data);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAddUser(name);
    setNewName('');
    setShowAdd(false);
  };

  const handleDelete = (user: UserProfile) => {
    if (confirm(`「${user.name}」を削除しますか？\nこのメンバーの寄付記録も全て削除されます。`)) {
      onDeleteUser(user.id);
    }
  };

  return (
    <div>
      <div className="mb-5 pt-2">
        <h1 className="font-mincho text-2xl font-bold text-[#0c0a09] wa-dot">設定</h1>
      </div>
      <div className="space-y-5">
        {users.map(user => (
          <UserSettings
            key={user.id}
            user={user}
            onUpdate={onUpdate}
            onDelete={() => handleDelete(user)}
            canDelete={users.length > 1}
          />
        ))}

        {/* メンバー追加 */}
        {showAdd ? (
          <div className="bg-white border border-[#e7e5e4] rounded p-4">
            <label className="block text-xs font-semibold text-[#78716c] mb-1.5">メンバー名</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="例：父"
              autoFocus
              className="w-full border border-[#b91c1c] rounded px-3 py-2 text-[#0c0a09] focus:outline-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="flex-1 bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-40 text-white text-sm font-semibold py-2.5 rounded transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewName(''); }}
                className="flex-1 bg-[#0c0a09] hover:bg-black text-white text-sm font-semibold py-2.5 rounded transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full bg-[#0c0a09] hover:bg-black text-white text-sm font-semibold py-3 rounded transition-colors"
          >
            ＋ メンバーを追加
          </button>
        )}
      </div>
    </div>
  );
}
