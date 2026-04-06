import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3 } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/signals/PerformanceChart';
import {
  getActiveSignalsCount,
  getNewSignalsCount,
  getRecentSignals,
  mockPerformance,
  mockEquityCurve,
  mockSignalSubscriptions,
} from '../api/mock-data';
import { formatWinRate, formatPct } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';

const PERIODS = ['30D', '90D', 'ALL'];

export default function MainMenu() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('90D');
  // 0 = full data, 1 = signals but no history/chart, 2 = empty
  const [viewMode, setViewMode] = useState(0);
  const MODE_LABELS = ['Full', 'New', 'Empty'];
  const MODE_COLORS = ['rgba(128,128,128,0.1)', 'rgba(37,99,235,0.12)', 'rgba(139,92,246,0.15)'];
  const MODE_TEXT = ['var(--tg-theme-hint-color, #999)', '#2563eb', '#7c3aed'];

  const isEmpty = viewMode === 2;
  const noHistory = viewMode >= 1;

  const activeCount = isEmpty ? 0 : getActiveSignalsCount();
  const newCount = isEmpty ? 0 : getNewSignalsCount();
  const recentSignals = isEmpty ? [] : getRecentSignals(3);
  const stats = noHistory
    ? { total_return_pct: 0, win_rate: 0, triggered: 0, wins: 0, losses: 0 }
    : mockPerformance;
  const chartData = noHistory ? [] : (mockEquityCurve[period] || []);
  const totalReturn = formatPct(stats.total_return_pct);

  const toggleBtn = (
    <button
      type="button"
      onClick={() => setViewMode((viewMode + 1) % 3)}
      className="text-[11px] font-medium pressable"
      style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: MODE_COLORS[viewMode], color: MODE_TEXT[viewMode] }}
    >
      {MODE_LABELS[viewMode]}
    </button>
  );

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="TRAID Signals" rightElement={toggleBtn} />

      <div style={{ height: '12px' }} />

      {isEmpty ? (
        /* ═══ Empty state — no signals at all ═══ */
        <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
          <div style={{ width: '100%', height: '180px', position: 'relative', marginBottom: '32px', opacity: 0.15 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none" fill="none">
              <path d="M0 160 Q50 140 80 145 T160 120 T240 100 T320 70 T400 40" stroke="var(--tg-theme-hint-color, #999)" strokeWidth="2" fill="none" />
              <path d="M0 160 Q50 140 80 145 T160 120 T240 100 T320 70 T400 40 L400 180 L0 180 Z" fill="var(--tg-theme-hint-color, #999)" opacity="0.1" />
              <line x1="0" y1="180" x2="400" y2="180" stroke="var(--tg-theme-hint-color, #999)" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="180" stroke="var(--tg-theme-hint-color, #999)" strokeWidth="0.5" />
            </svg>
          </div>
          <BarChart3 size={32} className="text-tg-hint/30" style={{ marginBottom: '16px' }} />
          <p className="text-[16px] font-semibold text-tg-text" style={{ marginBottom: '8px' }}>No signals yet</p>
          <p className="text-[13px] text-tg-hint" style={{ marginBottom: '24px', maxWidth: '260px', lineHeight: '1.5' }}>
            Create your first signal subscription to start receiving trading signals and tracking performance
          </p>
          <button
            type="button"
            onClick={() => navigate('/new-signal')}
            className="icon-gradient-green text-white text-[14px] font-semibold pressable flex items-center"
            style={{ padding: '12px 24px', borderRadius: '7px', gap: '8px' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            Create signal
          </button>
        </div>
      ) : (
        <>
          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
              <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Return</span>
              <span
                className={`text-[18px] font-mono font-bold leading-none ${
                  totalReturn.isPositive ? 'text-green' : totalReturn.isNegative ? 'text-red' : 'text-tg-text'
                }`}
                style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}
              >
                {totalReturn.text}
              </span>
            </div>
            <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
              <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Win rate</span>
              <span className="text-[18px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>
                {formatWinRate(stats.win_rate)}
              </span>
              <span className="text-[9px] text-tg-hint/50 font-mono leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '1px' }}>({stats.triggered})</span>
            </div>
            <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
              <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>New</span>
              <span className="text-[18px] font-mono font-bold text-violet leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{newCount}</span>
            </div>
            <div className="card flex flex-col items-center text-center" style={{ padding: '10px 4px' }}>
              <span className="text-[9px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.04em' }}>Active</span>
              <span className="text-[18px] font-mono font-bold text-green leading-none" style={{ fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}>{activeCount}</span>
            </div>
          </div>

          {/* Equity curve or placeholder */}
          <div style={{ marginBottom: '24px' }}>
            {noHistory ? (
              /* Chart placeholder — signals exist but no completed trades */
              <div className="flex flex-col items-center justify-center text-center" style={{ padding: '24px 0' }}>
                <div style={{ width: '100%', height: '120px', position: 'relative', marginBottom: '16px', opacity: 0.12 }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" fill="none">
                    <path d="M0 100 Q50 90 80 95 T160 80 T240 65 T320 45 T400 25" stroke="var(--tg-theme-hint-color, #999)" strokeWidth="2" fill="none" />
                    <path d="M0 100 Q50 90 80 95 T160 80 T240 65 T320 45 T400 25 L400 120 L0 120 Z" fill="var(--tg-theme-hint-color, #999)" opacity="0.15" />
                  </svg>
                </div>
                <p className="text-[13px] text-tg-hint" style={{ maxWidth: '240px', lineHeight: '1.5' }}>
                  Performance chart will appear once signals start completing
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                  <span className="text-[13px] font-semibold text-tg-text">Equity curve</span>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPeriod(p)}
                        className={`flex items-center justify-center text-[12px] font-semibold transition-all duration-200 ${
                          period === p
                            ? 'bg-tg-text/8 text-tg-text'
                            : 'text-tg-hint'
                        }`}
                        style={{ minWidth: '44px', minHeight: '36px', borderRadius: '4px' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <PerformanceChart data={chartData} loading={false} />
              </>
            )}
          </div>

          {/* Recent signals */}
          {recentSignals.length > 0 && (
            <>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <span className="text-[12px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
                  Recent signals
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/signals')}
                  className="text-[13px] font-medium text-tg-accent pressable"
                >
                  View all
                </button>
              </div>
              <div className="flex flex-col" style={{ gap: '16px' }}>
                {recentSignals.map((signal) => {
                  const sub = mockSignalSubscriptions.find((s) => s.id === signal.subscription_id);
                  return (
                    <SignalCard
                      key={signal.id}
                      signal={signal}
                      subscription={sub}
                      onClick={() => navigate(`/signals/${signal.id}`)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}
