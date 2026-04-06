import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Trophy, ArrowRight } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/signals/PerformanceChart';
import {
  getActiveSignalsCount,
  getNewSignalsCount,
  getRecentSignals,
  mockPerformance,
  mockEquityCurve,
  mockSignalSubscriptions,
  mockTemplates,
} from '../api/mock-data';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';
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
        /* ═══ Empty state — no signals, with hooks ═══ */
        <div>
          {/* Hero CTA */}
          <div className="flex flex-col items-center text-center" style={{ paddingTop: '32px', paddingBottom: '24px' }}>
            <BarChart3 size={28} className="text-tg-hint/30" style={{ marginBottom: '12px' }} />
            <p className="text-[16px] font-semibold text-tg-text" style={{ marginBottom: '6px' }}>Start receiving trading signals</p>
            <p className="text-[13px] text-tg-hint" style={{ marginBottom: '16px', maxWidth: '280px', lineHeight: '1.5' }}>
              Create your first configuration or use a proven template from top performers
            </p>
            <button
              type="button"
              onClick={() => navigate('/new-signal')}
              className="btn icon-gradient-green text-white pressable flex items-center justify-center"
              style={{ gap: '8px', width: '100%' }}
            >
              <Plus size={18} strokeWidth={2.5} />
              Create signal
            </button>
          </div>

          {/* Top templates */}
          <div style={{ marginBottom: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <span className="text-[12px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
                Top templates
              </span>
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="text-[13px] font-medium text-tg-accent pressable"
              >
                View all
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mockTemplates.slice(0, 3).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => navigate(`/templates/${tpl.id}`)}
                  className="card pressable w-full text-left flex items-center"
                  style={{ padding: '14px' }}
                >
                  <div style={{ flex: 1 }}>
                    <span className="text-[14px] font-semibold text-tg-text block">{tpl.name}</span>
                    <span className="text-[11px] text-tg-hint block" style={{ marginTop: '2px' }}>{tpl.description}</span>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0" style={{ marginLeft: '12px' }}>
                    <span className={`text-[15px] font-mono font-bold ${pnlColorClass(tpl.pnl_pct)}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatPct(tpl.pnl_pct).text}
                    </span>
                    <span className="text-[10px] text-tg-hint">WR {formatWinRate(tpl.win_rate)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription hook */}
          <button
            type="button"
            onClick={() => navigate('/account/plans')}
            className="card pressable w-full text-left"
            style={{ padding: '16px' }}
          >
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="icon-gradient-violet flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                <Trophy size={18} strokeWidth={1.8} className="text-white" />
              </div>
              <div style={{ flex: 1 }}>
                <span className="text-[14px] font-semibold text-tg-text block">Unlock more symbols</span>
                <span className="text-[12px] text-tg-hint block" style={{ marginTop: '2px' }}>
                  Upgrade to track up to 5 symbols from $5/mo
                </span>
              </div>
            </div>
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

          {/* Top templates */}
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <span className="text-[12px] uppercase font-medium text-tg-hint" style={{ letterSpacing: '0.06em' }}>
              Top templates
            </span>
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="text-[13px] font-medium text-tg-accent pressable"
            >
              View all
            </button>
          </div>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px', marginLeft: '-20px', marginRight: '-20px', paddingLeft: '20px', paddingRight: '20px' }}>
            {mockTemplates.slice(0, 5).map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => navigate(`/templates/${tpl.id}`)}
                className="card pressable text-left flex-shrink-0"
                style={{ padding: '12px', minWidth: '150px', flex: '1 0 auto' }}
              >
                <span className="text-[13px] font-semibold text-tg-text block" style={{ marginBottom: '4px' }}>{tpl.name}</span>
                <div className="flex items-center" style={{ gap: '6px' }}>
                  <span className={`text-[13px] font-mono font-bold ${pnlColorClass(tpl.pnl_pct)}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatPct(tpl.pnl_pct).text}
                  </span>
                  <span className="text-[10px] text-tg-hint">
                    WR {formatWinRate(tpl.win_rate)}
                  </span>
                </div>
              </button>
            ))}
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
