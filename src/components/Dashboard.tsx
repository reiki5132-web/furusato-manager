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

  const barColor = usageRate >= 90 ? 'bg-red-500' : usageRate >= 70 ? 'bg-yellow-500' : 'bg-green-500';
  const daysColor = daysLeft <= 30 ? 'text-red-600 font-bold' : daysLeft <= 60 ? 'text-yellow-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
        {limit === 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">上限額未設定</span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm gap-2">
          <span className="text-gray-500 shrink-0">年間控除上限額</span>
          <span className="font-semibold text-gray-800 text-right">
            {limit > 0 ? `¥${limit.toLocaleString()}` : '—'}
          </span>
        </div>
        <div className="flex justify-between text-sm gap-2">
          <span className="text-gray-500 shrink-0">寄付済み</span>
          <span className="font-semibold text-blue-600">¥{donated.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm gap-2">
          <span className="text-gray-500 shrink-0">残り枠</span>
          <span className="font-semibold text-green-600 text-right">
            {limit > 0 ? `¥${remaining.toLocaleString()}` : '—'}
            {limit > 0 && <span className="text-gray-400 text-xs ml-1">({100 - usageRate}%)</span>}
          </span>
        </div>

        {limit > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>使用率</span>
              <span>{usageRate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`${barColor} h-3 rounded-full transition-all`}
                style={{ width: `${usageRate}%` }}
              />
            </div>
          </div>
        )}

        <div className={`text-xs mt-2 ${daysColor}`}>
          {year}年12月31日まであと {daysLeft} 日
          {daysLeft <= 30 && ' ⚠️ 締め切り間近！'}
        </div>
      </div>
    </div>
  );
}

function ReminderBanner({ year }: { year: number }) {
  const today = new Date();
  const yearEnd = new Date(year, 11, 31);
  const onestopDeadline = new Date(year + 1, 0, 10); // 翌年1/10
  const daysLeft = Math.ceil((yearEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysToOnestop = Math.ceil((onestopDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft > 60) return null;

  return (
    <div className="space-y-2 mb-4">
      {daysLeft <= 60 && daysLeft > 0 && (
        <div className={`rounded-xl p-3 text-sm font-medium flex items-center gap-2 ${
          daysLeft <= 14 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          <span>⚠️</span>
          <span>ふるさと納税の締め切りまであと <strong>{daysLeft}日</strong>（{year}/12/31）</span>
        </div>
      )}
      {daysLeft <= 0 && daysToOnestop > 0 && (
        <div className="bg-orange-100 text-orange-700 rounded-xl p-3 text-sm font-medium flex items-center gap-2">
          <span>📮</span>
          <span>ワンストップ特例の申請期限まであと <strong>{daysToOnestop}日</strong>（{year + 1}/1/10）</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ data, year }: Props) {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-700 mb-4">{year}年 寄付状況</h1>
      <ReminderBanner year={year} />
      <div className="flex gap-4 flex-col sm:flex-row">
        <UserCard data={data} userId="rino" year={year} />
        <UserCard data={data} userId="haha" year={year} />
      </div>
    </div>
  );
}
