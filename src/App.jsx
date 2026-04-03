import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Terms from './pages/Terms';
import NewSignalWizard from './pages/NewSignalWizard';
import MySignals from './pages/MySignals';
import SignalDetail from './pages/SignalDetail';
import SignalPerformance from './pages/SignalPerformance';
import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionCurrent from './pages/SubscriptionCurrent';
import TabBar from './components/shared/TabBar';

/* Routes where the TG back button should be hidden */
const TOP_LEVEL_ROUTES = ['/', '/terms', '/signals', '/account', '/new-signal'];

/* Routes where TabBar should be hidden */
const HIDE_TABBAR_ROUTES = ['/terms', '/new-signal'];

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
    if (!tg) return;

    const isTopLevel = TOP_LEVEL_ROUTES.includes(location.pathname);
    const BackButton = tg.BackButton;

    if (!BackButton) return;

    if (isTopLevel) {
      BackButton.hide();
    } else {
      BackButton.show();
    }

    function handleBack() {
      navigate(-1);
    }

    BackButton.onClick(handleBack);

    return () => {
      BackButton.offClick(handleBack);
    };
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

function shouldShowTabBar(pathname) {
  return !HIDE_TABBAR_ROUTES.includes(pathname);
}

export default function App() {
  const location = useLocation();

  useTelegramInit();
  useTelegramBackButton();
  useTermsGate();

  const showTabBar = shouldShowTabBar(location.pathname);

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      <div className={showTabBar ? 'pb-20' : ''}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/new-signal" element={<NewSignalWizard />} />
          <Route path="/signals" element={<MySignals />} />
          <Route path="/signals/:id" element={<SignalDetail />} />
          <Route path="/performance" element={<SignalPerformance />} />
          <Route path="/account" element={<SubscriptionCurrent />} />
          <Route path="/account/plans" element={<SubscriptionPlans />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showTabBar && <TabBar />}
    </div>
  );
}
