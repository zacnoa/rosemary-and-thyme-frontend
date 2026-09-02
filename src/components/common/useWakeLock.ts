import { createSignal, onCleanup } from "solid-js";

/**
 * Provides the useWakeLock function.
 */
export function useWakeLock() {
  const [active, setActive] = createSignal(false);
  const [supported, setSupported] = createSignal(false);
  let sentinel: WakeLockSentinel | null = null;

  const acquire = async () => {
    try {
      sentinel = await navigator.wakeLock.request("screen");
      setActive(true);
      sentinel.addEventListener("release", () => setActive(false));
    } catch {
      // permission denied, battery saver mode, or some other failure -
      // nothing to clean up, just stay inactive
      setActive(false);
    }
  };

  const release = async () => {
    await sentinel?.release();
    sentinel = null;
    setActive(false);
  };

  const toggle = () => {
    if (!supported()) return;
    active() ? release() : acquire();
  };

  if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
    setSupported(true);

    const onVisibilityChange = () => {
      if (active() && !sentinel && document.visibilityState === "visible") {
        acquire();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    onCleanup(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (active()) release();
    });
  }

  return { active, supported, toggle };
}
