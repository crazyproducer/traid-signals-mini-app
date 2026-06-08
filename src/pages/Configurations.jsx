import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pause, Play, Trash2, Pencil } from 'lucide-react';
import Badge from '../components/shared/Badge';
import PageHeader from '../components/shared/PageHeader';
import EmptyState from '../components/shared/EmptyState';
import SkeletonListRow from '../components/shared/SkeletonListRow';
import { listConfigs, pauseConfig, resumeConfig, deleteConfig } from '../api/signals';
import { SYMBOLS } from '../utils/constants';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';
import useFetchWithCache from '../hooks/useFetchWithCache';

function fmtSymbols(syms) {
  const labels = (syms || []).map((s) => SYMBOLS.find((x) => x.value === s)?.base || s);
  if (labels.length <= 3) return labels.join(', ');
  return labels.slice(0, 3).join(', ') + ` +${labels.length - 3}`;
}

// Map the gateway's ConfigResponse shape onto whatever the card was
// already reading. Mostly identity — the API matches the new shape, the
// old fields (.directions / .pnl_pct / .win_rate) are derived legacy
// labels that aren't returned (per-config performance comes from Phase 3c
// /performance scoped by config_id, deferred until needed).
function ConfigCard({ config, onEdit, onToggle, onDelete }) {
  const isPaused = config.status === 'paused';
  const pnlValue = config.pnl_pct ?? 0;
  const pnl = formatPct(pnlValue);

  const dirs = (config.signal_sides && config.signal_sides.length > 0)
    ? config.signal_sides.map((s) => (s === 'BUY' ? 'Long' : 'Short'))
    : ['Long'];
  const dirLabel = dirs.length > 1 ? dirs.join(' & ') : dirs[0];

  const stratLabel = (config.strategy === 'pullback') ? 'Pull Back' : (config.strategy || 'Pull Back');

  const emas = config.ema_filters || [];
  const emaLabel = emas.length > 0 ? emas.map((v) => `EMA ${v}`).join(', ') : 'None';

  // Frequency display — derive from timeframe.
  const freqLabel = config.timeframe === '1DAY' ? '24h' : '4h';
  const riskPct = config.risk_level ?? 0;
  const minWr = config.min_win_rate ?? 0;

  return (
    <div className="card" style={{ padding: '16px' }}>
      {/* Header: strategy + status + direction */}
      <div className="flex items-center" style={{ marginBottom: '12px', gap: '6px' }}>
        <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em', flex: 1 }}>
          {stratLabel}
        </span>
        <Badge variant={isPaused ? 'paused' : 'active'}>
          {isPaused ? 'Paused' : 'Active'}
        </Badge>
      </div>

      {/* Config details */}
      <div className="flex items-center" style={{ gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span className="text-[11px] text-tg-text font-medium">{dirLabel}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-text font-medium">{fmtSymbols(config.symbols)}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">{freqLabel}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">Risk {riskPct}%</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">WR ≥ {Math.round(minWr * 100)}%</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">{emaLabel}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: '8px' }}>
        <button
          type="button"
          onClick={onToggle}
          className="pressable flex items-center justify-center text-[12px] font-semibold"
          style={{ flex: 1, padding: '8px', borderRadius: '6px', gap: '6px', backgroundColor: 'rgba(128,128,128,0.08)', color: 'var(--tg-theme-text-color, #1a1a1a)' }}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="pressable flex items-center justify-center text-[12px] font-semibold"
          style={{ flex: 1, padding: '8px', borderRadius: '6px', gap: '6px', backgroundColor: 'rgba(128,128,128,0.08)', color: 'var(--tg-theme-text-color, #1a1a1a)' }}
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="pressable flex items-center justify-center text-[12px] font-semibold"
          style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Configurations() {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState(null);

  // Cache the configs list — returning users see their last-known
  // configs instantly; first cold-start shows skeletons.
  const { data, loading, refresh } = useFetchWithCache(
    'configs:list',
    () => listConfigs(),
  );
  const configs = data?.configs || [];

  // Optimistic mutation: kick the action, then re-fetch + re-cache. On
  // failure, surface message and still refresh (server is source of truth).
  const handleToggle = (config) => {
    setActionError(null);
    const fn = config.status === 'paused' ? resumeConfig : pauseConfig;
    fn(config.config_id)
      .then(refresh)
      .catch((e) => { setActionError(e?.message || 'Toggle failed'); refresh(); });
  };

  const handleDelete = (config) => {
    setActionError(null);
    deleteConfig(config.config_id)
      .then(refresh)
      .catch((e) => { setActionError(e?.message || 'Delete failed'); refresh(); });
  };

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader
        title="Configs"
        showBack
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/new-signal')}
            className="pressable flex items-center text-[12px] font-semibold text-tg-accent"
            style={{ gap: '4px' }}
          >
            <Plus size={16} strokeWidth={2} />
            Create
          </button>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {[0, 1, 2].map((i) => <SkeletonListRow key={`sk-${i}`} />)}
        </div>
      ) : configs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {actionError && (
            <p className="text-[12px] text-red text-center" style={{ marginBottom: '4px' }}>{actionError}</p>
          )}
          {configs.map((config) => (
            <ConfigCard
              key={config.config_id}
              config={config}
              onEdit={() => navigate('/new-signal')}
              onToggle={() => handleToggle(config)}
              onDelete={() => handleDelete(config)}
            />
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '12px' }}>
          <EmptyState
            icon={Plus}
            title="No configurations yet"
            subtitle="Create your first signal configuration to start receiving signals"
            action={{ label: 'Create configuration', onClick: () => navigate('/new-signal') }}
          />
        </div>
      )}
    </div>
  );
}
