import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, showBack, rightElement }) {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, paddingTop: '10px', paddingBottom: '10px', marginLeft: '-20px', marginRight: '-20px', paddingLeft: '20px', paddingRight: '20px', backgroundColor: 'var(--tg-theme-bg-color, #fff)', borderBottom: '1px solid rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {showBack ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-tg-text pressable"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={20} strokeWidth={2} />
          <span className="text-[22px] font-bold" style={{ letterSpacing: '-0.03em' }}>{title}</span>
        </button>
      ) : (
        <span className="text-[22px] font-bold text-tg-text" style={{ letterSpacing: '-0.03em' }}>{title}</span>
      )}
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
