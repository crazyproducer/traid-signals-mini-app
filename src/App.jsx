import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import MainMenu from './pages/MainMenu';
import Terms from './pages/Terms';
import NewSignalWizard from './pages/NewSignalWizard';
import MySignals from './pages/MySignals';
import SignalDetail from './pages/SignalDetail';
import SignalPerformance from './pages/SignalPerformance';
import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionCurrent from './pages/SubscriptionCurrent';

/* Routes where the TG back button should be hidden */
const TOP_LEVEL_ROUTES = ['/', '/terms'];

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

export default function App() {
  useTelegramInit();
  useTelegramBackButton();
  useTermsGate();

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/new-signal" element={<NewSignalWizard />} />
        <Route path="/signals" element={<MySignals />} />
        <Route path="/signals/:id" element={<SignalDetail />} />
        <Route path="/performance" element={<SignalPerformance />} />
        <Route path="/subscription" element={<SubscriptionPlans />} />
        <Route path="/subscription/current" element={<SubscriptionCurrent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
