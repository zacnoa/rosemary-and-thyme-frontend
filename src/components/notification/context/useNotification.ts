import { useContext } from "solid-js";
import { NotificationContext } from "./notificationContext";

/**
 * Provides the useNotification function.
 */
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
}
