import { Accessor, createContext } from "solid-js";

export type NotificationType = "success" | "error";

/** The single currently-visible toast, or `null` when none is showing - see NotificationProvider, which only ever keeps one at a time. */
export type Notification = {
  type: NotificationType;
  message: string;
} | null;

export type NotificationContextType = {
  notification: Accessor<Notification>;
  notify: (type: NotificationType, message: string) => void;
  dismiss: () => void;
};

export const NotificationContext = createContext<NotificationContextType>();
