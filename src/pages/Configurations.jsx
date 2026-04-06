import { useNavigate } from 'react-router-dom';
import { Plus, Pause, Play, Trash2, Pencil } from 'lucide-react';
import Badge from '../components/shared/Badge';
import PageHeader from '../components/shared/PageHeader';
import EmptyState from '../components/shared/EmptyState';
import { mockSignalSubscriptions } from '../api/mock-data';
import { SYMBOLS } from '../utils/constants';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';

function fmtSymbols(syms) {
  const labels = (syms || []).map((s) => SYMBOLS.find((x) => x.value === s)?.base || s);
  if (labels.length <= 3) return labels.join(', ');
  return labels.slice(0, 3).join(', ') + ` +${labels.length - 3}`;
}

function ConfigCard({ config, onEdit, onToggle, onDelete }) {
  const isPaused = config.status === 'paused';
  const pnl = formatPct(config.pnl_pct || 0);
  const emaLabel = config.ema_filter ? `EMA ${config.ema_filter}` : 'None';

  return (
    <div className="card" style={{ padding: '16px' }}>
      {/* Header: strategy + status + direction */}
      <div className="flex items-center" style={{ marginBottom: '12px', gap: '8px' }}>
        <span className="text-[16px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em', flex: 1 }}>
          Pull Back
        </span>
        <Badge variant={config.direction === 'LONG' ? 'long' : config.direction === 'SHORT' ? 'short' : 'active'}>
          {config.direction}
        </Badge>
        <Badge variant={isPaused ? 'paused' : 'active'}>
          {isPaused ? 'Paused' : 'Active'}
        </Badge>
      </div>

      {/* Config details */}
      <div className="flex items-center" style={{ gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span className="text-[11px] text-tg-hint">
          <span className="text-tg-text font-medium">{fmtSymbols(config.symbols)}</span>
        </span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">{config.frequency === '4h' ? '4h' : '24h'}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">Risk {config.risk_level}%</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">Conf {Math.round(config.confidence * 100)}%+</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">{emaLabel}</span>
      </div>

      {/* Performance metrics */}
      <div className="flex items-center" style={{ gap: '12px', marginBottom: '14px' }}>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Signals</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {config.signals_count}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Win Rate</span>
          <span className="text-[13px] font-mono font-semibold text-green" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatWinRate(config.win_rate || 0)}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>PnL</span>
          <span className={`text-[13px] font-mono font-semibold ${pnlColorClass(config.pnl_pct || 0)}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {pnl.text}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>W/L</span>
          <span className="text-[13px] font-mono font-semibold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {config.wins || 0}/{config.losses || 0}
          </span>
        </div>
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
  const configs = mockSignalSubscriptions;

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Configurations" showBack />

      {configs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {configs.map((config) => (
            <ConfigCard
              key={config.id}
              config={config}
              onEdit={() => navigate('/new-signal')}
              onToggle={() => {}}
              onDelete={() => {}}
            />
          ))}

          {/* Create new button */}
          <button
            type="button"
            onClick={() => navigate('/new-signal')}
            className="card pressable flex items-center justify-center text-[14px] font-semibold text-tg-accent"
            style={{ padding: '14px', gap: '8px' }}
          >
            <Plus size={18} strokeWidth={2} />
            Create new configuration
          </button>
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
