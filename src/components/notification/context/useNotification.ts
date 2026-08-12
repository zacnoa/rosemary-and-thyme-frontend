import { useContext } from "solid-js";
import { NotificationContext } from "./notificationContext";

/**
 * @returns `notify(type, message)` to show a toast (see queries usage
 * throughout, e.g. RecipeProvider.saveRecipe) and `dismiss()`/`notification`
 * for the modal itself.
 * @throws if called outside a NotificationProvider
 */
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
}
