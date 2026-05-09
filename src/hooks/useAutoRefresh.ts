"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  intervalMs:    number;          // poll cadence
  pauseWhenHidden?: boolean;       // skip polling when tab is hidden (default: true)
  onError?:      (err: unknown) => void;
}

interface AutoRefreshResult<T> {
  data:        T;
  isFetching:  boolean;
  lastUpdated: number | null;     // unix ms
  error:       unknown | null;
  refresh:     () => Promise<void>;
}

/**
 * Generic auto-refresh hook for keeping any server-rendered data fresh.
 * Polls a URL on a fixed cadence and re-renders with the latest payload.
 *
 * Saves bandwidth by pausing while the tab is hidden (Page Visibility API).
 * Resumes immediately when the tab becomes visible again.
 *
 * @param initialData  Server-rendered data passed as a prop
 * @param url          API endpoint to refetch (must return same shape as initialData)
 * @param opts.intervalMs   Poll cadence (e.g. 5000 for 5s)
 *
 * @example
 * const { data: news, lastUpdated } = useAutoRefresh<NewsItem[]>(initial, "/api/news", { intervalMs: 30_000 });
 */
export function useAutoRefresh<T>(
  initialData: T,
  url:         string,
  opts:        Options,
): AutoRefreshResult<T> {
  const { intervalMs, pauseWhenHidden = true, onError } = opts;

  const [data,        setData]        = useState<T>(initialData);
  const [isFetching,  setIsFetching]  = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error,       setError]       = useState<unknown | null>(null);

  // Keep latest closure values without re-creating the interval
  const urlRef = useRef(url);
  urlRef.current = url;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  async function refresh() {
    setIsFetching(true);
    try {
      const res = await fetch(urlRef.current, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as T;
      setData(json);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err) {
      setError(err);
      onErrorRef.current?.(err);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    let timer:    ReturnType<typeof setInterval> | null = null;

    function start() {
      if (timer) return;
      timer = setInterval(() => {
        if (cancelled) return;
        if (pauseWhenHidden && document.visibilityState === "hidden") return;
        void refresh();
      }, intervalMs);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        // Refresh immediately on tab return so user never sees stale snapshot
        void refresh();
        start();
      } else if (pauseWhenHidden) {
        stop();
      }
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [intervalMs, pauseWhenHidden]);

  return { data, isFetching, lastUpdated, error, refresh };
}
