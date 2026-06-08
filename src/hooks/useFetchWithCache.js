/**
 * useFetchWithCache — stale-while-revalidate hook for Telegram Mini App.
 *
 * Why this exists: Mini Apps open frequently (multiple times a day per
 * user). The vanilla `useEffect + setState` pattern shows empty default
 * state for ~200-500ms while the first network request resolves —
 * "flash of empty content". This hook fixes it two ways:
 *
 *  1. Synchronously hydrates from localStorage on mount. Returning users
 *     see their last-known data INSTANTLY (no flash, no skeleton).
 *  2. For brand-new users (no cache yet) we surface a real `loading`
 *     flag, so screens can render a skeleton placeholder in the same
 *     shape as the upcoming content.
 *
 * In all cases, a fresh network request is fired in the background and
 * the result replaces the cached value when it lands.
 *
 * Cache layout:
 *   localStorage key = `traid-cache:<key>`
 *   value           = { data: <serializable>, ts: <ms epoch> }
 *
 * No TTL by default — cache lives until explicitly invalidated or the
 * fetcher returns a different value. Telegram WebView aggressively
 * preserves localStorage across opens, so cache is effectively durable.
 *
 * @param {string} key           Stable cache key (e.g. "feed:new", "perf:90D")
 * @param {() => Promise<T>} fetcher
 * @param {object} [opts]
 * @param {boolean} [opts.enabled=true]  Skip fetch + ignore cache when false
 * @param {(raw: unknown) => boolean} [opts.isValid]  Reject corrupt cache
 *
 * @returns {{ data: T | null, loading: boolean, error: Error | null,
 *             refresh: () => void, isStale: boolean }}
 *
 *   - data:    last-known data (from cache or fresh fetch); null only
 *              when no cache AND no fetch result yet.
 *   - loading: true ONLY during cold-start fetch (no cache). Returning
 *              users with a cache hit get loading=false immediately.
 *   - isStale: true when we're showing cached data while a background
 *              fetch is in flight. Lets screens dim a "refreshing…"
 *              indicator if desired.
 *   - refresh: imperatively re-fetch (e.g. after a mutation).
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const CACHE_PREFIX = 'traid-cache:';

function readCache(key, isValid) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (isValid && !isValid(parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() }),
    );
  } catch {
    // QuotaExceeded or private-mode storage — cache is best-effort,
    // silently degrade.
  }
}

export default function useFetchWithCache(key, fetcher, opts = {}) {
  const { enabled = true, isValid } = opts;

  // Hydrate from cache SYNCHRONOUSLY on first render. This is the
  // whole point of the hook — initial render reflects last-known data
  // instead of an empty placeholder.
  const [data, setData] = useState(() =>
    enabled ? readCache(key, isValid) : null,
  );
  const [loading, setLoading] = useState(() =>
    enabled ? data === null : false,
  );
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(() =>
    enabled ? data !== null : false,
  );

  // Track in-flight requests so unmount/re-key cancels cleanly without
  // setting state on a dead component.
  const reqIdRef = useRef(0);

  const doFetch = useCallback(() => {
    if (!enabled) return;
    const myReqId = ++reqIdRef.current;
    setIsStale(data !== null);   // dim refresh indicator if showing cache
    setError(null);
    Promise.resolve()
      .then(fetcher)
      .then((fresh) => {
        if (myReqId !== reqIdRef.current) return;   // superseded
        setData(fresh);
        writeCache(key, fresh);
        setLoading(false);
        setIsStale(false);
      })
      .catch((e) => {
        if (myReqId !== reqIdRef.current) return;
        setError(e);
        setLoading(false);
        setIsStale(false);
        // If we have a cache hit, keep showing it on error — better
        // stale than empty.
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  // Fire fetch on mount + whenever key changes. We deliberately omit
  // `fetcher` from deps — callers usually create it inline so it'd
  // re-trigger on every render. The convention is: change `key` to
  // re-fetch (e.g. `feed:${tab}` when tab switches).
  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setIsStale(false);
      return;
    }
    // Re-hydrate when key changes (e.g. switching tabs).
    const cached = readCache(key, isValid);
    if (cached !== null) {
      setData(cached);
      setLoading(false);
      setIsStale(true);
    } else {
      setData(null);
      setLoading(true);
      setIsStale(false);
    }
    doFetch();
    return () => {
      reqIdRef.current += 1;   // mark in-flight requests stale
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const refresh = useCallback(() => {
    doFetch();
  }, [doFetch]);

  return { data, loading, error, refresh, isStale };
}

// Imperative cache nuke — handy after a logout, account switch, or
// schema change. Pass a prefix to match a subset (e.g. 'feed:').
export function invalidateCache(prefix = '') {
  try {
    const fullPrefix = CACHE_PREFIX + prefix;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(fullPrefix)) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // Silently degrade as above.
  }
}
