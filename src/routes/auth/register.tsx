import { createSignal, Show } from "solid-js"
import { A, useSearchParams } from "@solidjs/router"
import { registerUser } from "~/queries/registerUser"
import { API_URL } from "~/utils/apiUrl"
import { sanitizeRedirect } from "~/utils/loginRedirect"

/**
 * Provides the RegisterPage function.
 */
export default function RegisterPage() {

  const [searchParams] = useSearchParams()
  const redirectTarget = () =>
    sanitizeRedirect(Array.isArray(searchParams.redirect) ? searchParams.redirect[0] : searchParams.redirect)

  const [username, setUsername] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [pending, setPending] = createSignal(false)
  const [registered, setRegistered] = createSignal(false)

  const register = async (username: string, email: string, password: string) => {
    setError("")
    setPending(true)

    // try/finally - same reasoning as routes/auth/login.tsx's own login(): a
    // network failure or non-JSON error body rejects the promise rather than
    // returning a value, so without this the button would stay stuck on
    // "Creating account..." forever with no indication anything went wrong.
    try {
      const { ok, json } = await registerUser(username, email, password)

      if (!ok) {
        setError(json.detail ?? "Registration failed")
        return
      }

      // account exists but is unusable until the verification link is clicked -
      // no session cookie is set on register anymore, so there's nowhere to redirect to
      setRegistered(true)
    } catch {
      setError("Could not reach the server - check your connection and try again")
    } finally {
      setPending(false)
    }
  }

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <Show when={registered()}>
        <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight mb-6">
          Check your email
        </h1>
        <p class="text-foreground3">
          We sent a verification link to <strong>{email()}</strong>. Click it to activate your account, then log in.
        </p>
      </Show>

      <Show when={!registered()}>
        <form
          class="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault()
            register(username(), email(), password())
          }}
        >
          <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
            Register
          </h1>

          <div class="flex flex-col gap-1">
            <label for="username" class="text-sm md:text-base text-foreground3">Username</label>
            <input
              id="username"
              type="text"
              autocomplete="username"
              required
              class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm md:text-base text-foreground3">Email</label>
            <input
              id="email"
              type="email"
              autocomplete="email"
              required
              class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm md:text-base text-foreground3">Password</label>
            <input
              id="password"
              type="password"
              autocomplete="new-password"
              required
              class="outline-none bg-transparent border-b-2 border-foreground3 focus:border-orange py-1 text-base md:text-lg"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
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
            {pending() ? "Creating account..." : "Create account"}
          </button>

          {/* Same reasoning as routes/auth/login.tsx's own Google link - a plain navigation, not a fetch. */}
          <a
            href={`${API_URL}/auth/google?redirect=${encodeURIComponent(redirectTarget())}`}
            class="px-4 py-2 rounded-md border-2 border-foreground3 text-center font-bold"
          >
            Continue with Google
          </a>

          <p class="text-sm text-foreground3">
            Already have an account?{" "}
            <A href={`/auth/login?redirect=${encodeURIComponent(redirectTarget())}`} class="text-orange underline">
              Login
            </A>
          </p>
        </form>
      </Show>
    </main>
  )
}
