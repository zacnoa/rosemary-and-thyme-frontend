import { createSignal, ParentProps } from "solid-js";
import { Notification, NotificationContext, NotificationType } from "./notificationContext";
import NotificationModal from "../NotificationModal";

const DISPLAY_DURATION_MS = 4000;

/**
 * Provides the NotificationProvider function.
 */
export default function NotificationProvider(props: ParentProps) {
  const [notification, setNotification] = createSignal<Notification>(null);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  /**
 * Provides the dismiss function.
 */
  const dismiss = () => {
    clearTimeout(timeoutId);
    setNotification(null);
  };

  /**
 * Provides the notify function.
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
