import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Radio, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/new-signal', label: 'New Signal', icon: PlusCircle },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tg-section/90 backdrop-blur-2xl border-t border-tg-secondary/30">
      <div className="flex pb-[env(safe-area-inset-bottom,0px)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex items-center justify-center py-2 transition-all duration-200 relative"
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-tg-button" />
              )}
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={`transition-all duration-200 ${
                    active ? 'text-tg-button scale-105' : 'text-tg-hint'
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
                </div>
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
