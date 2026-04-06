export default function PageHeader() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, paddingTop: '10px', paddingBottom: '10px', marginLeft: '-20px', marginRight: '-20px', paddingLeft: '20px', paddingRight: '20px', backgroundColor: 'var(--tg-theme-bg-color, #fff)', borderBottom: '1px solid rgba(128,128,128,0.12)' }}>
      <span className="text-[22px] font-bold text-tg-text" style={{ letterSpacing: '-0.03em' }}>
        TRAID Signals
      </span>
    </div>
  );
}
