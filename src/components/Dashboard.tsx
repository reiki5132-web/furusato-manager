import type { AppData, UserId } from '../types';
import { getTotalDonated } from '../store';

interface Props {
  data: AppData;
  year: number;
}

function UserCard({ data, userId, year }: { data: AppData; userId: UserId; year: number }) {
  const user = data.users[userId];
  const donated = getTotalDonated(data, userId, year);
  const limit = user.limitAmount;
  const remaining = Math.max(0, limit - donated);
  const usageRate = limit > 0 ? Math.min(100, Math.round((donated / limit) * 100)) : 0;

  const today = new Date();
  const yearEnd = new Date(year, 11, 31);
  const daysLeft = Math.ceil((yearEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white border border-[#e7e5e4] rounded relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[3px] h-full bg-[#b91c1c]" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mincho text-lg font-bold text-[#0c0a09]">{user.name}</h2>
          {limit === 0 && (
            <span className="text-[10px] bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] px-2 py-0.5 rounded">上限額未設定</span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-[#78716c] shrink-0">年間控除上限額</span>
            <span className="font-mincho font-bold text-[#0c0a09] text-right">
              {limit > 0 ? `¥${limit.toLocaleString()}` : '—'}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-[#78716c] shrink-0">寄付済み</span>
            <span className="font-semibold text-[#0c0a09]">¥{donated.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-[#78716c] shrink-0">残り枠</span>
            <span className="font-semibold text-[#b91c1c] text-right">
              {limit > 0 ? `¥${remaining.toLocaleString()}` : '—'}
              {limit > 0 && <span className="text-[#78716c] text-xs ml-1 font-normal">({100 - usageRate}%)</span>}
            </span>
          </div>

          {limit > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-[#78716c] mb-1">
                <span>使用率</span>
                <span>{usageRate}%</span>
              </div>
              <div className="w-full bg-[#f5f5f4] rounded h-1.5">
                <div
                  className="bg-[#b91c1c] h-1.5 rounded transition-all"
                  style={{ width: `${usageRate}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-[11px] mt-2 text-[#78716c]">
            {year}年12月31日まで あと <span className={daysLeft <= 30 ? 'text-[#b91c1c] font-bold' : 'font-semibold text-[#0c0a09]'}>{daysLeft}日</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReminderBanner({ year }: { year: number }) {
  const today = new Date();
  const yearEnd = new Date(year, 11, 31);
  const onestopDeadline = new Date(year + 1, 0, 10);
  const daysLeft = Math.ceil((yearEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysToOnestop = Math.ceil((onestopDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft > 60) return null;

  return (
    <div className="space-y-2 mb-4">
      {daysLeft <= 60 && daysLeft > 0 && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#7f1d1d] rounded p-3 text-sm">
          <span className="font-semibold">締め切りまで あと {daysLeft}日</span>
          <span className="text-xs ml-2 text-[#991b1b]">（{year}/12/31）</span>
        </div>
      )}
      {daysLeft <= 0 && daysToOnestop > 0 && (
        <div className="bg-white border border-[#e7e5e4] text-[#0c0a09] rounded p-3 text-sm">
          <span className="font-semibold">ワンストップ申請期限まで あと {daysToOnestop}日</span>
          <span className="text-xs ml-2 text-[#78716c]">（{year + 1}/1/10）</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ data, year }: Props) {
  return (
    <div>
      <div className="mb-4 pt-2">
        <h1 className="font-mincho text-2xl font-bold text-[#0c0a09] wa-dot">ホーム</h1>
        <p className="text-xs text-[#78716c] mt-1 ml-4">{year}年 寄付状況</p>
      </div>
      <ReminderBanner year={year} />
      <div className="space-y-3">
        <UserCard data={data} userId="rino" year={year} />
        <UserCard data={data} userId="haha" year={year} />
      </div>
    </div>
  );
}
