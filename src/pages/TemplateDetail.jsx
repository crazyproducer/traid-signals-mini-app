import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Badge from '../components/shared/Badge';
import PerformanceChart from '../components/signals/PerformanceChart';
import { HistorySignalCard } from '../components/signals/SignalCard';
import { mockTemplates, mockTemplateSignals, mockTemplateEquityCurve } from '../api/mock-data';
import { SYMBOLS } from '../utils/constants';
import { formatWinRate, formatPct, pnlColorClass } from '../utils/formatters';

function fmtSymbols(syms) {
  const labels = (syms || []).map((s) => SYMBOLS.find((x) => x.value === s)?.base || s);
  return labels.join(', ');
}

export default function TemplateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tpl = mockTemplates.find((t) => t.id === id);

  if (!tpl) {
    return (
      <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
        <PageHeader title="Template" showBack />
        <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: '60px' }}>
          <p className="text-[16px] font-semibold text-tg-text" style={{ marginBottom: '8px' }}>Template not found</p>
          <button type="button" onClick={() => navigate('/templates')} className="text-[14px] font-medium text-tg-accent pressable">
            Back to templates
          </button>
        </div>
      </div>
    );
  }

  const pnl = formatPct(tpl.pnl_pct);
  const dirs = tpl.directions || [];
  const emas = tpl.ema_filters || [];

  return (
    <div className="page-padding" style={{ paddingTop: '0px', paddingBottom: '96px' }}>
      <PageHeader
        title="Template"
        showBack
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/new-signal')}
            className="icon-gradient-green text-white text-[12px] font-semibold pressable flex items-center"
            style={{ padding: '6px 14px', borderRadius: '6px', gap: '5px' }}
          >
            Use
            <ArrowRight size={14} />
          </button>
        }
      />

      {/* Hero */}
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <div className="flex items-center" style={{ gap: '6px', marginBottom: '6px' }}>
          <h2 className="text-[20px] font-bold text-tg-text" style={{ letterSpacing: '-0.02em' }}>
            {tpl.name}
          </h2>
          {dirs.map((d) => (
            <Badge key={d} variant={d === 'LONG' ? 'long' : 'short'}>{d}</Badge>
          ))}
        </div>
        <p className="text-[13px] text-tg-hint" style={{ lineHeight: '1.4' }}>{tpl.description}</p>
      </div>

      {/* Metrics row */}
      <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px' }}>
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>PnL</span>
          <span className={`text-[16px] font-mono font-bold ${pnlColorClass(tpl.pnl_pct)}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {pnl.text}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Win Rate</span>
          <span className="text-[16px] font-mono font-bold text-green" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatWinRate(tpl.win_rate)}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Signals</span>
          <span className="text-[16px] font-mono font-bold text-tg-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {tpl.triggered}
          </span>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(128,128,128,0.15)' }} />
        <div>
          <span className="text-[9px] text-tg-hint/60 uppercase block" style={{ letterSpacing: '0.04em' }}>Users</span>
          <span className="text-[16px] font-mono font-bold text-tg-text flex items-center" style={{ fontVariantNumeric: 'tabular-nums', gap: '3px' }}>
            <Users size={12} className="text-tg-hint/50" />
            {tpl.users}
          </span>
        </div>
      </div>

      {/* Equity curve */}
      <div style={{ marginBottom: '20px' }}>
        <span className="text-[12px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.06em', marginBottom: '12px' }}>
          Performance
        </span>
        <div className="card" style={{ padding: '12px', overflow: 'hidden' }}>
          <PerformanceChart data={mockTemplateEquityCurve} loading={false} />
        </div>
      </div>

      {/* Config summary */}
      <div style={{ marginBottom: '20px' }}>
        <span className="text-[12px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.06em', marginBottom: '12px' }}>
          Configuration
        </span>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tg-hint">Symbols</span>
              <span className="text-[12px] font-semibold text-tg-text">{fmtSymbols(tpl.symbols)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tg-hint">Timeframe</span>
              <span className="text-[12px] font-semibold text-tg-text">{tpl.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tg-hint">Risk level</span>
              <span className="text-[12px] font-semibold text-tg-text">{tpl.risk_level}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tg-hint">Confidence</span>
              <span className="text-[12px] font-semibold text-tg-text">{Math.round(tpl.confidence * 100)}%+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tg-hint">Filters</span>
              <span className="text-[12px] font-semibold text-tg-text">{emas.length > 0 ? emas.map((v) => `EMA ${v}`).join(', ') : 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signal history */}
      <div style={{ marginBottom: '20px' }}>
        <span className="text-[12px] uppercase font-medium text-tg-hint block" style={{ letterSpacing: '0.06em', marginBottom: '12px' }}>
          Recent signals ({mockTemplateSignals.length})
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockTemplateSignals.map((signal) => (
            <HistorySignalCard key={signal.id} signal={signal} onClick={() => {}} />
          ))}
        </div>
      </div>

    </div>
  );
}
