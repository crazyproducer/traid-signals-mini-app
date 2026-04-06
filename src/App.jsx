import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import TabBar from './components/shared/TabBar';
import MainMenu from './pages/MainMenu';
import Terms from './pages/Terms';
import NewSignalWizard from './pages/NewSignalWizard';
import MySignals from './pages/MySignals';
import SignalDetail from './pages/SignalDetail';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Configurations from './pages/Configurations';
import SubscriptionCurrent from './pages/SubscriptionCurrent';
import Learn from './pages/Learn';

/* Routes where TG back button is hidden */
const TOP_LEVEL_ROUTES = ['/', '/terms', '/signals', '/learn', '/account', '/new-signal'];

/* Routes where TabBar is hidden */
const HIDE_TAB_BAR = ['/terms'];

function useTermsGate() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accepted = localStorage.getItem('terms_accepted') === 'true';
    if (!accepted && location.pathname !== '/terms') {
      navigate('/terms', { replace: true });
    }
  }, [location.pathname, navigate]);
}

function useTelegramBackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const tg = useMemo(() => window.Telegram?.WebApp, []);

  useEffect(() => {
    if (!tg?.BackButton) return;

    const isTopLevel = TOP_LEVEL_ROUTES.includes(location.pathname);

    if (isTopLevel) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }

    function handleBack() {
      navigate(-1);
    }

    tg.BackButton.onClick(handleBack);
    return () => tg.BackButton.offClick(handleBack);
  }, [tg, location.pathname, navigate]);
}

function useTelegramInit() {
  const tg = useMemo(() => window.Telegram?.WebApp, []);

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, [tg]);
}

export default function App() {
  useTelegramInit();
  useTelegramBackButton();
  useTermsGate();

  const location = useLocation();
  const showTabBar = !HIDE_TAB_BAR.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-[100dvh] bg-tg-bg text-tg-text">
      <div className={showTabBar ? 'pb-20' : ''}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/new-signal" element={<NewSignalWizard />} />
          <Route path="/signals" element={<MySignals />} />
          <Route path="/signals/:id" element={<SignalDetail />} />
          <Route path="/configurations" element={<Configurations />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/account" element={<SubscriptionCurrent />} />
          <Route path="/account/plans" element={<SubscriptionPlans />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showTabBar && <TabBar />}
    </div>
  );
}
