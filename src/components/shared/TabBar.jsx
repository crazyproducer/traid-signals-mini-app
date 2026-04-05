import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, Radio, BookOpen, User } from 'lucide-react';

const leftTabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/signals', label: 'Signals', icon: Radio },
];

const rightTabs = [
  { path: '/learn', label: 'Learn', icon: BookOpen },
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
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
      >
        <Icon
          size={24}
          strokeWidth={active ? 2.2 : 1.6}
          className={active ? 'text-tg-button' : 'text-tg-hint'}
        />
        <span className={`text-[10px] ${active ? 'text-tg-button font-semibold' : 'text-tg-hint font-medium'}`}>
          {tab.label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Raised create button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
        <button
          type="button"
          onClick={() => navigate('/new-signal')}
          className="w-14 h-14 rounded-full icon-gradient-green flex items-center justify-center pressable"
          style={{ boxShadow: '0 4px 20px -2px rgba(5, 150, 105, 0.5)' }}
        >
          <Plus size={28} strokeWidth={2.5} className="text-white" />
        </button>
      </div>

      {/* Bar */}
      <div className="bg-tg-section/95 backdrop-blur-2xl border-t border-[color-mix(in_srgb,var(--tg-theme-text-color,#000)_6%,transparent)]">
        <div className="flex items-end pb-[env(safe-area-inset-bottom,0px)]">
          {leftTabs.map(renderTab)}

          {/* Center spacer */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
            <div className="h-6" />
            <span className="text-[10px] text-tg-hint font-medium">Create</span>
          </div>

          {rightTabs.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
