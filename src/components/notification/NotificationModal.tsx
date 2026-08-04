import { Show } from "solid-js";
import { CircleCheck, CircleX, X } from "lucide-solid";
import { useNotification } from "./context/useNotification";

export default function NotificationModal() {
  const { notification, dismiss } = useNotification();

  return (
    <Show when={notification()}>
      {(n) => (
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto md:min-w-sm">
          <div
            class={`flex items-center gap-3 rounded-md p-3 shadow-lg text-background ${n().type === "success" ? "bg-green" : "bg-red"
              }`}
          >
            <Show when={n().type === "success"} fallback={<CircleX class="size-6 shrink-0" />}>
              <CircleCheck class="size-6 shrink-0" />
            </Show>
            <p class="flex-1 text-sm md:text-base">{n().message}</p>
            <button
              class="cursor-pointer shrink-0"
              onClick={dismiss}
              aria-label="Dismiss notification"
            >
              <X class="size-5" />
            </button>
          </div>
        </div>
      )}
    </Show>
  );
}
