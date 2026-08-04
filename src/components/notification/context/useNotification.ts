import { useContext } from "solid-js";
import { NotificationContext } from "./notificationContext";

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
}
