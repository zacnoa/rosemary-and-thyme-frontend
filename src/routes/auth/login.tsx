import { createSignal, Show } from "solid-js"
import { A } from "@solidjs/router"

export default function LoginPage() {

  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")
  const [error, setError] = createSignal("")
  const [pending, setPending] = createSignal(false)

  const loginUser = async (email: string, password: string) => {
    setError("")
    setPending(true)

    const result = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    if (!result.ok) {
      const json = await result.json()
      setError(json.detail ?? "Login failed")
      setPending(false)
      return
    }

    window.location.href = "/"
  }

  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2">
      <form
        class="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          loginUser(email(), password())
        }}
      >
        <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
          Login
        </h1>

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
            autocomplete="current-password"
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
          {pending() ? "Logging in..." : "Log in"}
        </button>

        <p class="text-sm text-foreground3">
          Don't have an account?{" "}
          <A href="/auth/register" class="text-orange underline">
            Register
          </A>
        </p>
      </form>
    </main>
  )
}
