import { createSignal, Show } from "solid-js"
import { A, useSearchParams } from "@solidjs/router"
import { confirmPasswordReset } from "~/queries/confirmPasswordReset"

type Status = "form" | "pending" | "success" | "error"

/**
 * Provides the ResetPasswordPage function.
 */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = () => (Array.isArray(searchParams.token) ? searchParams.token[0] : searchParams.token)

  const [status, setStatus] = createSignal<Status>("form")
  const [newPassword, setNewPassword] = createSignal("")
  const [error, setError] = createSignal("")

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()

    const rawToken = token()
    if (!rawToken) {
      setStatus("error")
      setError("Missing reset token")
      return
    }

    setStatus("pending")

    // try/catch - a network failure or non-JSON error body rejects the
    // promise rather than returning a value; without this the form would
    // stay stuck on "pending" (button disabled, no error shown) forever.
    try {
      const { ok, json } = await confirmPasswordReset(rawToken, newPassword())

      if (!ok) {
        setStatus("error")
        setError(json?.detail ?? "Password reset failed")
        return
      }

      setStatus("success")
      window.location.href = "/"
    } catch {
      setStatus("error")
      setError("Could not reach the server - check your connection and try again")
    }
  }

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight mb-6">
        Reset password
      </h1>

      <Show when={status() === "success"}>
        <p class="text-foreground3">Password changed, logging you in...</p>
      </Show>

      <Show when={status() === "error"}>
        <p class="text-red text-sm mb-4">{error()}</p>
        <p class="text-sm text-foreground3">
          <A href="/auth/forgot-password" class="text-orange underline">
            Request a new link
          </A>
        </p>
      </Show>

      <Show when={status() === "form" || status() === "pending"}>
        <form class="flex flex-col gap-6" onSubmit={submit}>
          <div class="flex flex-col gap-1">
            <label for="new-password" class="text-sm md:text-base text-foreground3">New password</label>
            <input
              id="new-password"
              type="password"
              autocomplete="new-password"
              required
              class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
              value={newPassword()}
              onInput={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status() === "pending"}
            class="px-4 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold disabled:opacity-50"
          >
            {status() === "pending" ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </Show>
    </main>
  )
}
