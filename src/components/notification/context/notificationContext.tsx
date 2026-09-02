import { Accessor, createContext } from "solid-js";

export type NotificationType = "success" | "error" | "loading";

/**
 * Defines the Notification type.
 */
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
