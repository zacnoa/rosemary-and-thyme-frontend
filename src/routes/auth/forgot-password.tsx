import { createSignal, Show } from "solid-js"
import { A } from "@solidjs/router"
import { requestPasswordReset } from "~/queries/requestPasswordReset"

/**
 * Entry point for the "forgot password" flow (linked from routes/auth/login.tsx) -
 * takes just an email, then always shows the same "check your email" confirmation
 * regardless of whether that email is actually registered - see
 * PasswordResetService.requestReset on the backend for why (avoids leaking which
 * emails are registered or how they sign in). Same shape as routes/auth/register.tsx's
 * own post-submit state.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = createSignal("")
  const [pending, setPending] = createSignal(false)
  const [sent, setSent] = createSignal(false)
  const [error, setError] = createSignal("")

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()
    setPending(true)
    setError("")

    // requestPasswordReset always resolves ok:true for any real server
    // response (see its own KDoc - avoids leaking registration status), so
    // the only way this can fail is a network failure never reaching the
    // server at all - a plain try/catch is enough, no ok check needed.
    try {
      await requestPasswordReset(email())
      setSent(true)
    } catch {
      setError("Could not reach the server - check your connection and try again")
    } finally {
      setPending(false)
    }
  }

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <Show when={sent()}>
        <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight mb-6">
          Check your email
        </h1>
        <p class="text-foreground3">
          If an account exists for <strong>{email()}</strong>, we sent a link to reset your password. The link expires in 1 hour.
        </p>
      </Show>

      <Show when={!sent()}>
        <form class="flex flex-col gap-6" onSubmit={submit}>
          <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
            Forgot password
          </h1>

          <p class="text-sm text-foreground3">
            Enter your email and we'll send you a link to reset your password.
          </p>

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

          <Show when={error()}>
            <p class="text-red text-sm">{error()}</p>
          </Show>

          <button
            type="submit"
            disabled={pending()}
            class="px-4 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold disabled:opacity-50"
          >
            {pending() ? "Sending..." : "Send reset link"}
          </button>

          <p class="text-sm text-foreground3">
            <A href="/auth/login" class="text-orange underline">
              Back to login
            </A>
          </p>
        </form>
      </Show>
    </main>
  )
}
