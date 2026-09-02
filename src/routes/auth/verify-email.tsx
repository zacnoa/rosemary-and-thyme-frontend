import { createSignal, onMount, Show } from "solid-js"
import { A, useSearchParams } from "@solidjs/router"
import { verifyEmail } from "~/queries/verifyEmail"

type Status = "pending" | "success" | "error"

/**
 * Provides the VerifyEmailPage function.
 */
export default function VerifyEmailPage() {

  const [searchParams] = useSearchParams()
  const [status, setStatus] = createSignal<Status>("pending")
  const [error, setError] = createSignal("")

  onMount(async () => {
    const token = searchParams.token

    if (!token || Array.isArray(token)) {
      setStatus("error")
      setError("Missing verification token")
      return
    }

    // try/catch - a network failure or non-JSON error body rejects the
    // promise rather than returning a value; without this the page would
    // stay stuck on "Verifying..." forever with no indication anything went wrong.
    try {
      const { ok, json } = await verifyEmail(token)

      if (!ok) {
        setStatus("error")
        setError(json?.detail ?? "Verification failed")
        return
      }

      setStatus("success")
      window.location.href = "/"
    } catch {
      setStatus("error")
      setError("Could not reach the server - check your connection and try again")
    }
  })

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight mb-6">
        Email verification
      </h1>

      <Show when={status() === "pending"}>
        <p class="text-foreground3">Verifying your email...</p>
      </Show>

      <Show when={status() === "success"}>
        <p class="text-foreground3">Email verified, logging you in...</p>
      </Show>

      <Show when={status() === "error"}>
        <p class="text-red text-sm mb-4">{error()}</p>
        <p class="text-sm text-foreground3">
          <A href="/auth/login" class="text-orange underline">
            Back to login
          </A>
        </p>
      </Show>
    </main>
  )
}
