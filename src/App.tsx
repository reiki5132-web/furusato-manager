import { useState, useEffect } from 'react';
import type { AppData, Donation, UserProfile } from './types';
import {
  loadData, saveData,
  addDonation, updateDonation, deleteDonation,
  updateUserProfile, addUser, deleteUser,
} from './store';
import Dashboard from './components/Dashboard';
import DonationList from './components/DonationList';
import GiftTracker from './components/GiftTracker';
import Settings from './components/Settings';
import './index.css';

type Tab = 'dashboard' | 'donations' | 'gifts' | 'settings';

// line-art SVG icons (stroke-based、和の線画に合わせる)
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
       stroke={active ? '#b91c1c' : '#78716c'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 11 L11 3 L20 11 L20 19 L2 19 Z" fill={active ? '#fef2f2' : '#fff'} />
    <path d="M8 19 V13 H14 V19" />
  </svg>
);
const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
       stroke={active ? '#b91c1c' : '#78716c'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="14" height="17" rx="1.5" fill={active ? '#fef2f2' : '#fff'} />
    <rect x="8" y="1.5" width="6" height="4" rx="1" fill={active ? '#fef2f2' : '#fafaf9'} />
    <line x1="7" y1="10" x2="15" y2="10" />
    <line x1="7" y1="13.5" x2="15" y2="13.5" />
    <line x1="7" y1="17" x2="12" y2="17" />
  </svg>
);
const GiftIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
       stroke={active ? '#b91c1c' : '#78716c'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="18" height="11" rx="1.5" fill={active ? '#fef2f2' : '#fff'} />
    <rect x="1" y="6" width="20" height="4" rx="1" fill={active ? '#fef2f2' : '#fff'} />
    <line x1="11" y1="6" x2="11" y2="20" />
    <path d="M11 6 C 6 0, 2 4, 8 6" fill={active ? '#fef2f2' : '#fff'} />
    <path d="M11 6 C 16 0, 20 4, 14 6" fill={active ? '#fef2f2' : '#fff'} />
  </svg>
);
const GearIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
       stroke={active ? '#b91c1c' : '#78716c'} strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="3.5" fill={active ? '#fef2f2' : '#fff'} />
    <line x1="11" y1="2" x2="11" y2="4.5" />
    <line x1="11" y1="17.5" x2="11" y2="20" />
    <line x1="2" y1="11" x2="4.5" y2="11" />
    <line x1="17.5" y1="11" x2="20" y2="11" />
    <line x1="4.6" y1="4.6" x2="6.4" y2="6.4" />
    <line x1="15.6" y1="4.6" x2="17.4" y2="6.4" />
    <line x1="4.6" y1="17.4" x2="6.4" y2="15.6" />
    <line x1="15.6" y1="17.4" x2="17.4" y2="15.6" />
  </svg>
);

const NAV_ITEMS: { id: Tab; label: string; Icon: (p: { active: boolean }) => React.JSX.Element }[] = [
  { id: 'dashboard', label: 'ホーム', Icon: HomeIcon },
  { id: 'donations', label: '寄付記録', Icon: ListIcon },
  { id: 'gifts', label: '返礼品', Icon: GiftIcon },
  { id: 'settings', label: '設定', Icon: GearIcon },
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
  const handleAddUser = (name: string) => setData(prev => addUser(prev, name));
  const handleDeleteUser = (id: string) => setData(prev => deleteUser(prev, id));

  return (
    <div className="min-h-screen wa-asanoha flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c]" />
          <h1 className="font-mincho text-xl font-bold text-[#0c0a09] leading-none">ふるさと納税</h1>
        </div>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="bg-white border border-[#e7e5e4] text-sm rounded px-2 py-1 text-[#0c0a09]"
        >
          {[2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto px-4 pb-28">
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
        {tab === 'gifts' && (
          <GiftTracker
            data={data}
            year={year}
            onUpdate={handleUpdateDonation}
          />
        )}
        {tab === 'settings' && (
          <Settings
            data={data}
            onUpdate={handleUpdateProfile}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-[#e7e5e4] flex">
        {NAV_ITEMS.map(item => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="flex-1 flex flex-col items-center pt-2.5 pb-3 relative"
            >
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#b91c1c]" />}
              <item.Icon active={active} />
              <span className={`text-[11px] mt-1 ${active ? 'font-bold text-[#b91c1c]' : 'text-[#78716c]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
