import { Accessor, createContext } from "solid-js";

export type NotificationType = "success" | "error";

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
