import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Radio, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/new-signal', label: 'New', icon: PlusCircle },
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tg-section/90 backdrop-blur-2xl border-t border-[color-mix(in_srgb,var(--tg-theme-text-color,#000)_6%,transparent)]">
      <div className="flex pb-[env(safe-area-inset-bottom,0px)]">
        {tabs.map((tab) => {
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
        })}
      </div>
    </nav>
  );
}
