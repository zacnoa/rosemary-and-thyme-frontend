import { createSignal, Show } from "solid-js"
import { A, useSearchParams } from "@solidjs/router"
import { loginUser } from "~/queries/loginUser"
import { resendVerificationEmail } from "~/queries/resendVerificationEmail"
import { API_URL } from "~/utils/apiUrl"
import { sanitizeRedirect } from "~/utils/loginRedirect"

/**
 * On success, does a full `window.location.href` redirect rather than a
 * client-side route change, so the next page load re-resolves
 * queries/getUser.ts server-side and picks up the now-logged-in state (see
 * AuthProvider) - there's no way to update the auth context in place.
 *
 * A 403 specifically means "credentials were fine, but the email isn't
 * verified yet" (see AuthService.login on the backend) - that's the one
 * failure case with its own UI (a resend-verification-email button) instead
 * of just the generic error message.
 *
 * `redirectTarget` is the "return to where the visitor started" value carried
 * through a `?redirect=` query param (see utils/loginRedirect.ts, and every
 * `loginHref()` caller that lands someone here) - re-sanitized on read even
 * though the caller already sanitized it once, since it's still just a plain
 * string that arrived over the URL. Threaded into both the plain login
 * success redirect below and the "Continue with Google" link, which forwards
 * it through the backend/Google round trip via its own cookie (see
 * AuthController.startGoogleLogin / GoogleOidcSuccessHandler).
 */
export default function LoginPage() {

  const [searchParams] = useSearchParams()
  const redirectTarget = () =>
    sanitizeRedirect(Array.isArray(searchParams.redirect) ? searchParams.redirect[0] : searchParams.redirect)

  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [pending, setPending] = createSignal(false)
  const [unverified, setUnverified] = createSignal(false)
  const [resendSent, setResendSent] = createSignal(false)

  const login = async (email: string, password: string) => {
    setError("")
    setUnverified(false)
    setResendSent(false)
    setPending(true)

    // try/finally, not a bare await: loginUser() can throw instead of
    // resolving with ok:false - a network failure, a CORS rejection, or a
    // non-JSON error body (result.json() itself throws then) all reject the
    // promise rather than returning a value. Without catching that, this
    // function would exit before reaching setPending(false) below, leaving
    // the button stuck on "Logging in..." forever with no indication
    // anything went wrong - exactly what setError's fallback message here
    // is for.
    try {
      const { ok, status, json } = await loginUser(email, password)

      if (!ok) {
        setError(json.detail ?? "Login failed")
        setUnverified(status === 403)
        return
      }

      window.location.href = redirectTarget()
    } catch {
      setError("Could not reach the server - check your connection and try again")
    } finally {
      setPending(false)
    }
  }

  const resend = async () => {
    await resendVerificationEmail(email())
    setResendSent(true)
  }

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <form
        class="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          login(email(), password())
        }}
      >
        <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
          Login
        </h1>

        <div class="flex flex-col gap-1">
          <label for="email" class="text-fluid-sm-base text-foreground3">Email</label>
          <input
            id="email"
            type="email"
            autocomplete="email"
            required
            class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-fluid-base-lg"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="password" class="text-fluid-sm-base text-foreground3">Password</label>
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            required
            class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-fluid-base-lg"
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>

        <Show when={error()}>
          <p class="text-red text-sm">{error()}</p>
        </Show>

        <Show when={unverified()}>
          <Show
            when={!resendSent()}
            fallback={<p class="text-sm text-foreground3">Verification email sent - check your inbox.</p>}
          >
            <button
              type="button"
              onClick={resend}
              class="text-sm text-orange underline self-start cursor-pointer"
            >
              Resend verification email
            </button>
          </Show>
        </Show>

        <button
          type="submit"
          disabled={pending()}
          class="px-4 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold disabled:opacity-50"
        >
          {pending() ? "Logging in..." : "Log in"}
        </button>

        {/*
          A plain navigation, not a queries/*.ts fetch - this has to leave the SPA
          entirely for Google's own consent screen. `redirect` is forwarded as-is
          (not client-side sanitized here) since the backend re-sanitizes it anyway
          on both ends of the round trip - see AuthController.startGoogleLogin.
        */}
        <a
          href={`${API_URL}/auth/google?redirect=${encodeURIComponent(redirectTarget())}`}
          class="px-4 py-2 rounded-md border-2 border-foreground3 text-center font-bold"
        >
          Continue with Google
        </a>

        <p class="text-sm text-foreground3">
          Don't have an account?{" "}
          <A href={`/auth/register?redirect=${encodeURIComponent(redirectTarget())}`} class="text-orange underline">
            Register
          </A>
        </p>
      </form>
    </main>
  )
}
