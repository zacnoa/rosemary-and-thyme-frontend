import { Accessor, createContext } from "solid-js";

export type NotificationType = "success" | "error" | "loading";

/**
 * The single currently-visible toast, or `null` when none is showing - see
 * NotificationProvider, which only ever keeps one at a time. `"loading"` is
 * the odd one out: unlike `"success"`/`"error"` it doesn't auto-dismiss
 * (see NotificationProvider.notify) since a loading toast is meant to be
 * shown for as long as some async action is actually running, e.g.
 * RecipeProvider.saveRecipe showing "Saving..." until the request settles
 * and replaces it with the real success/error result.
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
