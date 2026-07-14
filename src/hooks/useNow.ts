import { useEffect, useState } from "react";

/**
 * Returns a Date that ticks every second, resynchronizing to the wall clock
 * on each tick and whenever the tab becomes visible again. This prevents
 * drift when the browser throttles background timers.
 */
export function useNow(intervalMs: number = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const d = new Date();
      setNow(d);
      // Align next tick to the next full interval boundary so seconds stay in sync.
      const delay = intervalMs - (d.getTime() % intervalMs);
      timeoutId = setTimeout(tick, delay);
    };

    tick();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timeoutId);
        tick();
      }
    };
    const onFocus = () => {
      clearTimeout(timeoutId);
      tick();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
    };
  }, [intervalMs]);

  return now;
}

export default useNow;