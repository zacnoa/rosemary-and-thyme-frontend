import { createSignal, onCleanup } from "solid-js";

/**
 * Toggles the Screen Wake Lock API to keep the device's screen from
 * auto-sleeping/dimming while active - useful for following a recipe's steps
 * hands-on without the screen timing out mid-cook. Extracted out of the dock's old
 * icon-only `ScreenOnModule` (now removed - see components/blog/Blog.tsx, the
 * current only caller) so the same behavior can back a plain inline control instead
 * of a dock panel button.
 *
 * Unlike `ScreenOnModule`, which only ever ran inside a `clientOnly()`-wrapped dock
 * and so could touch `navigator`/`document` directly at setup time, this hook's
 * caller is server-rendered - `typeof navigator !== "undefined"` below guards every
 * such access so calling this hook during SSR is a no-op (unsupported, inactive)
 * rather than a crash; the real check re-runs once the component mounts on the
 * client, same as any other Solid signal set from a client-only effect.
 *
 * Behavior once supported:
 * 1. [toggle] calls `navigator.wakeLock.request("screen")`, keeping the resolved
 *    `WakeLockSentinel` in a plain variable (not a signal - nothing needs to react
 *    to the sentinel object itself, only to whether the lock is currently held).
 * 2. The browser can revoke a wake lock on its own at any time - most notably
 *    whenever the tab is backgrounded. The sentinel's own `"release"` event (not
 *    the click handler) is what drives `active` back to `false`, so it stays true
 *    to reality even when the lock was dropped for a reason other than toggling it
 *    off deliberately.
 * 3. A `visibilitychange` listener re-acquires the lock as soon as the tab becomes
 *    visible again *if* the caller still has it toggled on - otherwise switching
 *    back to the tab would leave the screen unprotected with no visible change.
 * 4. [onCleanup] releases the lock if the caller unmounts while still active, so
 *    the screen doesn't stay held awake indefinitely after navigating away.
 *
 * @returns `active` (whether the lock is currently held), `supported` (`false`
 * during SSR and in any browser without the Wake Lock API), and `toggle` to
 * acquire/release it
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
