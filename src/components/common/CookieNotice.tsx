import { createSignal, onMount, Show } from "solid-js"
import { A } from "@solidjs/router"

const DISMISSED_KEY = "cookie_notice_dismissed"

/**
 * A one-line, non-blocking notice that the app uses cookies, linking to
 * routes/privacy.tsx - the permanent home for that link is the user dock
 * module's panel (see UserModule.tsx, both the signed-in and signed-out
 * branches), so this banner's text points there rather than being the only
 * place to find it. Purely informational, not an opt-in/opt-out consent
 * flow: every cookie this app sets (session_cookie, post_login_redirect,
 * JSESSIONID - see privacy.tsx's own cookie table) is strictly necessary for
 * signing in and staying signed in, which under GDPR/ePrivacy doesn't
 * require active consent, just disclosure. If the app ever adds a
 * non-essential cookie (analytics, ads), this needs to become a real
 * accept/reject control gating that script instead.
 *
 * "Don't show every time": dismissal is stored in `localStorage`, not a
 * cookie or a server-side flag - it's a per-browser UI preference with no
 * need to sync across devices or be readable by the server, exactly what
 * `localStorage` is for. Guarded like `useWakeLock` since this mounts from
 * app.tsx's server-rendered root: `visible` starts `false` so the very
 * first client render matches the server-rendered HTML exactly
 * (banner absent, no hydration mismatch) - `onMount` then runs only after
 * hydration completes and reads localStorage for real, flipping `visible` to
 * `true` for a first-time visitor. Repeat visitors briefly render nothing
 * (matching SSR) before `onMount` confirms they've already dismissed it and
 * leaves it hidden - no visible flash, since the "shown" state is never the
 * default.
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
