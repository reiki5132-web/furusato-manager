import { useState, useEffect } from 'react';
import type { AppData, Donation, UserProfile } from './types';
import {
  loadData, saveData,
  addDonation, updateDonation, deleteDonation, updateUserProfile,
} from './store';
import Dashboard from './components/Dashboard';
import DonationList from './components/DonationList';
import Settings from './components/Settings';
import './index.css';

type Tab = 'dashboard' | 'donations' | 'settings';

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'ホーム', icon: '🏠' },
  { id: 'donations', label: '寄付記録', icon: '📋' },
  { id: 'settings', label: '設定', icon: '⚙️' },
];

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const handleAddDonation = (d: Omit<Donation, 'id'>) => setData(prev => addDonation(prev, d));
  const handleUpdateDonation = (d: Donation) => setData(prev => updateDonation(prev, d));
  const handleDeleteDonation = (id: string) => setData(prev => deleteDonation(prev, id));
  const handleUpdateProfile = (p: UserProfile) => setData(prev => updateUserProfile(prev, p));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="whitespace-nowrap">
          <h1 className="text-base font-bold leading-tight">ふるさと納税</h1>
          <p className="text-xs opacity-80">家族管理ツール</p>
        </div>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="bg-orange-400 text-white text-sm rounded-lg px-2 py-1 border border-orange-300"
        >
          {[2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4 pb-24">
        {tab === 'dashboard' && <Dashboard data={data} year={year} />}
        {tab === 'donations' && (
          <DonationList
            data={data}
            year={year}
            onAdd={handleAddDonation}
            onUpdate={handleUpdateDonation}
            onDelete={handleDeleteDonation}
          />
        )}
        {tab === 'settings' && <Settings data={data} onUpdate={handleUpdateProfile} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-gray-200 flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs transition-colors ${
              tab === item.id
                ? 'text-orange-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
