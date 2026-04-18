import type { AppData, Donation, GiftStatus } from '../types';

interface Props {
  data: AppData;
  year: number;
  onUpdate: (d: Donation) => void;
}

const STATUS_CONFIG: Record<GiftStatus, { label: string; color: string; next: GiftStatus | null }> = {
  unsent:   { label: '未発送', color: 'bg-gray-100 text-gray-600',    next: 'shipped' },
  shipped:  { label: '発送済み', color: 'bg-blue-100 text-blue-700',  next: 'received' },
  received: { label: '受取済み', color: 'bg-green-100 text-green-700', next: null },
};

export default function GiftTracker({ data, year, onUpdate }: Props) {
  const donations = data.donations
    .filter(d => d.year === year && d.returnGiftName)
    .sort((a, b) => {
      const order: GiftStatus[] = ['shipped', 'unsent', 'received'];
      return order.indexOf(a.giftStatus ?? 'unsent') - order.indexOf(b.giftStatus ?? 'unsent');
    });

  const counts: Record<GiftStatus, number> = {
    unsent: donations.filter(d => (d.giftStatus ?? 'unsent') === 'unsent').length,
    shipped: donations.filter(d => d.giftStatus === 'shipped').length,
    received: donations.filter(d => d.giftStatus === 'received').length,
  };

  const advanceStatus = (d: Donation) => {
    const current = d.giftStatus ?? 'unsent';
    const next = STATUS_CONFIG[current].next;
    if (next) onUpdate({ ...d, giftStatus: next });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-700 mb-4">返礼品トラッカー {year}年</h1>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['unsent', 'shipped', 'received'] as GiftStatus[]).map(s => (
          <div key={s} className="bg-white rounded-xl shadow p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">{counts[s]}</p>
            <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">{STATUS_CONFIG[s].label}</p>
          </div>
        ))}
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">🎁</p>
          <p className="text-sm">返礼品のある寄付記録がありません</p>
          <p className="text-xs mt-1">寄付記録に返礼品名を入力してください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => {
            const status = d.giftStatus ?? 'unsent';
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={d.id} className="bg-white rounded-2xl shadow p-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        d.userId === 'rino' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {data.users[d.userId].name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">{d.municipalityName}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 truncate">{d.returnGiftName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{d.returnGiftCategory}</span>
                      {d.giftScheduledMonth && (
                        <span className="text-xs text-gray-400">📅 {d.giftScheduledMonth}</span>
                      )}
                    </div>
                    {cfg.next && (
                      <button
                        onClick={() => advanceStatus(d)}
                        className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1 rounded-lg transition-colors shrink-0"
                      >
                        {STATUS_CONFIG[cfg.next].label}に→
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
