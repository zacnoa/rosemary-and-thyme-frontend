import { createSignal, ParentProps } from "solid-js";
import { Notification, NotificationContext, NotificationType } from "./notificationContext";
import NotificationModal from "../NotificationModal";

const DISPLAY_DURATION_MS = 4000;

export default function NotificationProvider(props: ParentProps) {
  const [notification, setNotification] = createSignal<Notification>(null);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const dismiss = () => {
    clearTimeout(timeoutId);
    setNotification(null);
  };

  const notify = (type: NotificationType, message: string) => {
    clearTimeout(timeoutId);
    setNotification({ type, message });
    timeoutId = setTimeout(dismiss, DISPLAY_DURATION_MS);
  };

  return (
    <NotificationContext.Provider value={{ notification, notify, dismiss }}>
      {props.children}
      <NotificationModal />
    </NotificationContext.Provider>
  );
}
