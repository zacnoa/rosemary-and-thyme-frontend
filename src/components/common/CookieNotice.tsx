import { createSignal, onMount, Show } from "solid-js"
import { A } from "@solidjs/router"

const DISMISSED_KEY = "cookie_notice_dismissed"

/**
 * Provides the CookieNotice function.
 */
export default function CookieNotice() {
  const [visible, setVisible] = createSignal(false)

  onMount(() => {
    if (!readDismissed()) setVisible(true)
  })

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISSED_KEY, "1")
    } catch {
      // localStorage unavailable (private mode, blocked site data) - the
      // banner still hides for this page load, it just won't stay hidden
      // on the next visit
    }
  }

  return (
    <Show when={visible()}>
      <div class="fixed bottom-0 inset-x-0 z-50 bg-foreground2 border-t-2 border-foreground3 px-4 py-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm">
        <p class="text-background text-center">
          We use cookies that are strictly necessary to sign you in and keep
          you signed in. Read our{" "}
          <A href="/privacy" class="text-orange underline">
            Privacy Policy
          </A>{" "}
          - you can find this link anytime under the user icon in the dock.
        </p>
        <button
          type="button"
          onClick={dismiss}
          class="px-3 py-1 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold shrink-0"
        >
          OK
        </button>
      </div>
    </Show>
  )
}

function readDismissed(): boolean {
  if (typeof localStorage === "undefined") return true
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1"
  } catch {
    return true
  }
}
