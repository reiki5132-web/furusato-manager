import type { AppData, Donation, GiftStatus } from '../types';

interface Props {
  data: AppData;
  year: number;
  onUpdate: (d: Donation) => void;
}

const STATUS_CONFIG: Record<GiftStatus, { label: string; badgeCls: string; next: GiftStatus | null }> = {
  unsent:   { label: '未発送',   badgeCls: 'bg-[#fafaf9] border-[#e7e5e4] text-[#78716c]', next: 'shipped' },
  shipped:  { label: '発送済み', badgeCls: 'bg-white border-[#0c0a09] text-[#0c0a09]',   next: 'received' },
  received: { label: '受取済み', badgeCls: 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]', next: null },
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
      <div className="mb-4 pt-2">
        <h1 className="font-mincho text-2xl font-bold text-[#0c0a09] wa-dot">返礼品</h1>
        <p className="text-xs text-[#78716c] mt-1 ml-4">{year}年</p>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['unsent', 'shipped', 'received'] as GiftStatus[]).map(s => (
          <div key={s} className="bg-white border border-[#e7e5e4] rounded py-3 text-center">
            <p className="font-mincho text-2xl font-bold text-[#0c0a09]">{counts[s]}</p>
            <p className="text-[10px] text-[#78716c] mt-0.5">{STATUS_CONFIG[s].label}</p>
          </div>
        ))}
      </div>

      {donations.length === 0 ? (
        <div className="bg-white border border-[#e7e5e4] rounded p-10 text-center text-[#78716c]">
          <p className="text-sm">返礼品のある寄付記録がありません</p>
          <p className="text-xs mt-1">寄付記録に返礼品名を入力してください</p>
        </div>
      ) : (
        <div className="space-y-2">
          {donations.map(d => {
            const status = d.giftStatus ?? 'unsent';
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={d.id} className="bg-white border border-[#e7e5e4] rounded p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] bg-[#fafaf9] border border-[#e7e5e4] text-[#0c0a09] px-2 py-0.5 rounded shrink-0">
                      {data.users[d.userId]?.name ?? '?'}
                    </span>
                    <span className="text-[11px] text-[#78716c] truncate">{d.municipalityName}</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border shrink-0 ${cfg.badgeCls}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="font-mincho font-bold text-[#0c0a09] truncate">{d.returnGiftName}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#78716c]">{d.returnGiftCategory}</span>
                    {d.giftScheduledMonth && (
                      <span className="text-[11px] text-[#78716c]">📅 {d.giftScheduledMonth}</span>
                    )}
                  </div>
                  {cfg.next && (
                    <button
                      onClick={() => advanceStatus(d)}
                      className="text-xs bg-[#0c0a09] hover:bg-black text-white px-3 py-1 rounded transition-colors shrink-0 font-semibold"
                    >
                      {STATUS_CONFIG[cfg.next].label}に →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
