import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Trophy, ArrowRight } from 'lucide-react';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/signals/PerformanceChart';
import { getPerformance, getFeed } from '../api/signals';
import { mockTemplates } from '../api/mock-data';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';
import PageHeader from '../components/shared/PageHeader';
import SkeletonMetricCard from '../components/shared/SkeletonMetricCard';
import SkeletonChart from '../components/shared/SkeletonChart';
import SkeletonSignalCard from '../components/shared/SkeletonSignalCard';
import useFetchWithCache from '../hooks/useFetchWithCache';

const PERIODS = ['30D', '90D', 'ALL'];

export default function MainMenu() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('90D');

  // Cache-first fetches — returning users see last-known data instantly,
  // background refresh quietly replaces it. Cold-start (no cache) → the
  // `loading` flags below drive skeleton placeholders.
  const perfResult = useFetchWithCache(
    `home:perf:${period}`,
    () => getPerformance({ period }),
  );
  const newResult = useFetchWithCache(
    'home:feed:new',
    () => getFeed({ tab: 'new', limit: 100 }),
  );
  const activeResult = useFetchWithCache(
    'home:feed:active',
    () => getFeed({ tab: 'active', limit: 100 }),
  );
  const recentResult = useFetchWithCache(
    'home:feed:recent',
    () => getFeed({ tab: 'new', limit: 3 }),
  );

  const performance = perfResult.data;
  const newSignals = newResult.data?.items || [];
  const activeSignals = activeResult.data?.items || [];
  const recentSignals = recentResult.data?.items || [];

  // True only on cold start (no cache hit AND no fetch result yet). When
  // any of these are true we render skeletons; when all are false we
  // render real UI (possibly with stale cache, refreshing in background).
  const feedsLoading = newResult.loading || activeResult.loading
    || recentResult.loading;
  const perfLoading = perfResult.loading;

  // Derived state. We DELIBERATELY only compute isEmpty once we know
  // the answer — if feeds are still cold-starting, treat as "loading"
  // not "empty" to avoid flashing the empty CTA.
  const newCount = newSignals.length;
  const activeCount = activeSignals.length;
  const isEmpty = !feedsLoading && newCount === 0 && activeCount === 0;
  const noHistory = !perfLoading && (
    !performance || performance.total_signals === 0
    || (performance.equity_curve || []).length === 0
  );

  const stats = performance || { total_return_pct: 0, win_rate: 0, triggered: 0, wins: 0, losses: 0 };
  const chartData = noHistory ? [] : (performance?.equity_curve || []);
  const totalReturn = formatPct(stats.total_return_pct);

  const toggleBtn = null;   // viewMode toggle was a dev-only affordance; real
                            // state derives from data now.

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

          {/* Top templates — same horizontal scroll as full state */}
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

          {/* Subscription CTA */}
          <button
            type="button"
            onClick={() => navigate('/account/plans')}
            className="card pressable w-full text-left"
            style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(37,99,235,0.06) 100%)' }}
          >
            <div className="flex items-center" style={{ gap: '14px' }}>
              <div className="icon-gradient-violet flex items-center justify-center flex-shrink-0" style={{ width: '44px', height: '44px', borderRadius: '6px' }}>
                <Trophy size={20} strokeWidth={1.8} className="text-white" />
              </div>
              <div style={{ flex: 1 }}>
                <span className="text-[15px] font-bold text-tg-text block">Subscribe now</span>
                <span className="text-[12px] text-tg-hint block" style={{ marginTop: '2px', lineHeight: '1.4' }}>
                  Get 2 months free with annual subscription
                </span>
              </div>
              <ArrowRight size={18} className="text-tg-hint/40 flex-shrink-0" />
            </div>
          </button>
        </div>
      ) : (
        <>
          {/* Metrics row — skeletons while ANY required data is cold-starting,
              otherwise real cards (possibly stale from cache). */}
          {(perfLoading || feedsLoading) ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
              <SkeletonMetricCard />
            </div>
          ) : (
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
          )}

          {/* Equity curve — skeleton if loading, placeholder if no history,
              real chart if data available. */}
          <div style={{ marginBottom: '24px' }}>
            {perfLoading ? (
              <SkeletonChart height={160} />
            ) : noHistory ? (
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

          {/* Recent signals — skeletons while feeds are cold-starting,
              real cards once loaded (hidden if loaded-and-empty to match
              the previous "no recent" behavior). */}
          {(recentResult.loading || recentSignals.length > 0) && (
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
                {recentResult.loading
                  ? [0, 1, 2].map((i) => <SkeletonSignalCard key={`sk-${i}`} />)
                  : recentSignals.map((signal) => (
                      <SignalCard
                        key={signal.id}
                        signal={signal}
                        onClick={() => navigate(`/signals/${signal.id}`)}
                      />
                    ))}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}
