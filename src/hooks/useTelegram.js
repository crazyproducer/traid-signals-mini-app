import { useEffect, useMemo } from 'react';

export default function useTelegram() {
  const tg = useMemo(() => window.Telegram?.WebApp, []);

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, [tg]);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    colorScheme: tg?.colorScheme,
    haptic: tg?.HapticFeedback,
  };
}
