import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, Radio, User } from 'lucide-react';

const sideTabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/signals', label: 'Signals', icon: Radio },
  { path: '/account', label: 'Account', icon: User },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const renderTab = (tab) => {
    const Icon = tab.icon;
    const active = isActive(tab.path);
    return (
      <button
        key={tab.path}
        type="button"
        onClick={() => navigate(tab.path)}
        className="flex-1 flex items-center justify-center py-2 relative"
      >
        {active && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-tg-button" />
        )}
        <div className="flex flex-col items-center gap-0.5">
          <Icon
            size={22}
            strokeWidth={active ? 2.2 : 1.6}
            className={`transition-colors duration-200 ${active ? 'text-tg-button' : 'text-tg-hint'}`}
          />
          <span
            className={`text-[10px] transition-colors duration-200 ${
              active ? 'text-tg-button font-semibold' : 'text-tg-hint font-medium'
            }`}
          >
            {tab.label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tg-section/90 backdrop-blur-2xl border-t border-[color-mix(in_srgb,var(--tg-theme-text-color,#000)_6%,transparent)]">
      <div className="flex items-end pb-[env(safe-area-inset-bottom,0px)]">
        {/* Home */}
        {renderTab(sideTabs[0])}

        {/* Signals */}
        {renderTab(sideTabs[1])}

        {/* Center: Create button — raised */}
        <div className="flex-1 flex items-center justify-center relative">
          <button
            type="button"
            onClick={() => navigate('/new-signal')}
            className="absolute -top-5 w-[52px] h-[52px] rounded-full icon-gradient-green flex items-center justify-center pressable shadow-lg"
          >
            <Plus size={26} strokeWidth={2.5} className="text-white" />
          </button>
          <div className="flex flex-col items-center gap-0.5 py-2 mt-3">
            <span className="text-[10px] text-tg-hint font-medium">Create</span>
          </div>
        </div>

        {/* Account */}
        {renderTab(sideTabs[2])}
      </div>
    </nav>
  );
}
