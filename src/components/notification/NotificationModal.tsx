import { Show } from "solid-js";
import { CircleCheck, CircleX, LoaderCircle, X } from "lucide-solid";
import { useNotification } from "./context/useNotification";

/**
 * Provides the NotificationModal function.
 */
export default function NotificationModal() {
  const { notification, dismiss } = useNotification();

  return (
    <Show when={notification()}>
      {(n) => (
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto md:min-w-sm">
          <div
            class={`flex items-center gap-3 rounded-md p-3 shadow-lg text-background ${n().type === "success" ? "bg-green" : n().type === "error" ? "bg-red" : "bg-foreground2"
              }`}
          >
            <Show when={n().type === "success"}>
              <CircleCheck class="size-6 shrink-0" />
            </Show>
            <Show when={n().type === "error"}>
              <CircleX class="size-6 shrink-0" />
            </Show>
            <Show when={n().type === "loading"}>
              <LoaderCircle class="size-6 shrink-0 animate-spin" />
            </Show>
            <p class="flex-1 text-sm md:text-base">{n().message}</p>
            <Show when={n().type !== "loading"}>
              <button
                class="cursor-pointer shrink-0"
                onClick={dismiss}
                aria-label="Dismiss notification"
              >
                <X class="size-5" />
              </button>
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
}
