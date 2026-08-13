import { createSignal, ParentProps } from "solid-js";
import { Notification, NotificationContext, NotificationType } from "./notificationContext";
import NotificationModal from "../NotificationModal";

const DISPLAY_DURATION_MS = 4000;

/**
 * App-wide toast notifications - a single slot, not a queue: calling
 * [notify] while one is already showing replaces it outright (see below)
 * rather than stacking a second toast. Mounted once, near the root (see
 * app.tsx), and renders its own NotificationModal so callers just call
 * `notify(...)` from anywhere via useNotification() without needing to
 * render anything themselves.
 */
export default function NotificationProvider(props: ParentProps) {
  const [notification, setNotification] = createSignal<Notification>(null);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  /** Hides the current notification immediately (also called automatically after [DISPLAY_DURATION_MS] - see notify). */
  const dismiss = () => {
    clearTimeout(timeoutId);
    setNotification(null);
  };

  /**
   * Shows a toast, auto-dismissing after [DISPLAY_DURATION_MS] - except for
   * `type: "loading"`, which is left showing indefinitely (no timer is
   * started for it at all) since it's meant to track an in-progress action
   * of unknown duration rather than a fire-and-forget message. Clears any
   * pending auto-dismiss timer first, so calling this again while a toast is
   * already showing (e.g. a `"loading"` toast being replaced by the
   * `"success"`/`"error"` result once the action finishes) swaps its content
   * and restarts the countdown, rather than the old timer dismissing the new
   * message early.
   */
  const notify = (type: NotificationType, message: string) => {
    clearTimeout(timeoutId);
    setNotification({ type, message });
    if (type !== "loading") {
      timeoutId = setTimeout(dismiss, DISPLAY_DURATION_MS);
    }
  };

  return (
    <NotificationContext.Provider value={{ notification, notify, dismiss }}>
      {props.children}
      <NotificationModal />
    </NotificationContext.Provider>
  );
}
