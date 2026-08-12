import { Eye, EyeOff } from "lucide-solid";
import { createSignal, onCleanup, Show } from "solid-js";

// Both EditorDock and BlogDock (the only places this is used) are loaded
// via clientOnly(), so this component never runs during SSR - navigator/
// document can be touched directly at setup time below, no onMount needed.
const SUPPORTED = "wakeLock" in navigator;

/**
 * Toggles the Screen Wake Lock API to keep the device's screen from
 * auto-sleeping/dimming while active - useful for following a recipe's
 * steps hands-on without the screen timing out mid-cook and needing to be
 * woken back up (and re-authenticated past a lock screen) every time.
 *
 * Workflow:
 * 1. On click, if not currently active: [acquire] calls
 *    `navigator.wakeLock.request("screen")`, which resolves to a
 *    `WakeLockSentinel` kept in the plain `sentinel` variable (not a signal -
 *    nothing needs to react to the sentinel object itself, only to whether
 *    we're currently locked, via the [active] signal).
 * 2. The browser can revoke a wake lock on its own at any time - most
 *    notably whenever the tab is backgrounded (switching tabs, minimizing,
 *    locking the phone screen). The sentinel fires its own `"release"`
 *    event when that happens, which is what actually drives `setActive(false)`
 *    here - not the click handler - so [active] stays true to reality even
 *    when the lock was dropped for a reason other than the user clicking
 *    the button again.
 * 3. Because of that silent revoke-on-hide behavior, a `visibilitychange`
 *    listener re-[acquire]s the lock as soon as the tab becomes visible
 *    again *if* the user still has it toggled on - otherwise switching back
 *    to the tab would leave the screen unprotected again with no visible
 *    change (the icon would already show "on" from before backgrounding).
 * 4. [onCleanup] releases the lock if this button unmounts (navigating away
 *    from the recipe) while still active, so the screen doesn't stay held
 *    awake indefinitely after leaving the page.
 *
 * Not supported in every browser - `"wakeLock" in navigator` is checked
 * once up front ([SUPPORTED]); unsupported browsers get a disabled-looking,
 * inert button with an explanatory `title` rather than a broken click handler.
 */
export default function KeepScreenOnButton() {
  const [active, setActive] = createSignal(false);
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
    if (!SUPPORTED) return;
    active() ? release() : acquire();
  };

  if (SUPPORTED) {
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

  return (
    <li
      class={`rounded-md p-1 ${SUPPORTED ? "cursor-pointer" : "cursor-not-allowed opacity-50"} ${active() ? "bg-green" : "bg-red"
        }`}
      onClick={toggle}
      title={SUPPORTED ? undefined : "Keeping the screen on isn't supported in this browser"}
      aria-label={active() ? "Turn off keep-screen-on" : "Keep screen on"}
    >
      <Show
        when={active()}
        fallback={<EyeOff color="var(--color-background)" class="md:w-[30px] h-auto" />}
      >
        <Eye color="var(--color-background)" class="md:w-[30px] h-auto" />
      </Show>
    </li>
  );
}
