import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Badge from '../components/shared/Badge';
import { mockTemplates } from '../api/mock-data';
import { SYMBOLS } from '../utils/constants';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';

function fmtSymbols(syms) {
  const labels = (syms || []).map((s) => SYMBOLS.find((x) => x.value === s)?.base || s);
  if (labels.length <= 3) return labels.join(', ');
  return labels.slice(0, 3).join(', ') + ` +${labels.length - 3}`;
}

function TemplateCard({ template, onUse, onView }) {
  const pnl = formatPct(template.pnl_pct);
  const dirs = template.directions || [];

  return (
    <div className="card pressable" style={{ padding: '16px', cursor: 'pointer' }} onClick={onView}>
      {/* Header: name + badges */}
      <div style={{ marginBottom: '10px' }}>
        <div className="flex items-center" style={{ gap: '6px', marginBottom: '4px' }}>
          <span className="text-[15px] font-semibold text-tg-text" style={{ letterSpacing: '-0.01em', flex: 1 }}>
            {template.name}
          </span>
          {dirs.map((d) => (
            <Badge key={d} variant={d === 'LONG' ? 'long' : 'short'}>{d}</Badge>
          ))}
        </div>
        <p className="text-[12px] text-tg-hint" style={{ lineHeight: '1.4' }}>
          {template.description}
        </p>
      </div>

      {/* Config summary */}
      <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span className="text-[11px] text-tg-text font-medium">{fmtSymbols(template.symbols)}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">{template.frequency}</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">Risk {template.risk_level}%</span>
        <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <span className="text-[11px] text-tg-hint">Conf {Math.round(template.confidence * 100)}%+</span>
      </div>

      {/* Performance metrics */}
      <div className="flex items-center" style={{ gap: '12px', marginBottom: '14px' }}>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>PnL</span>
          <span className={`text-[14px] font-mono font-bold ${pnlColorClass(template.pnl_pct)}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {pnl.text}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Win Rate</span>
          <span className="text-[14px] font-mono font-bold text-green" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatWinRate(template.win_rate)}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Signals</span>
          <span className="text-[14px] font-mono font-bold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {template.triggered}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Users</span>
          <span className="text-[14px] font-mono font-bold text-tg-text flex items-center" style={{ fontVariantNumeric: 'tabular-nums', gap: '3px' }}>
            <Users size={11} className="text-tg-hint/50" />
            {template.users}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center" style={{ gap: '8px' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onUse(); }}
          className="pressable flex-1 flex items-center justify-center text-[13px] font-semibold text-tg-accent"
          style={{ padding: '10px', borderRadius: '6px', gap: '6px', backgroundColor: 'rgba(37,99,235,0.06)' }}
        >
          Use template
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();

  // Sort by PnL descending
  const sorted = [...mockTemplates].sort((a, b) => b.pnl_pct - a.pnl_pct);

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader title="Templates" />

      <p className="text-[13px] text-tg-hint" style={{ marginTop: '12px', marginBottom: '16px', lineHeight: '1.5' }}>
        Top performing configurations from the community. Use as-is or customize before launching.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sorted.map((tpl, i) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            onView={() => navigate(`/templates/${tpl.id}`)}
            onUse={() => navigate('/new-signal')}
          />
        ))}
      </div>
    </div>
  );
}
