import { A } from "@solidjs/router";
import { Compass } from "lucide-solid";

/**
 * Provides the NotFound function.
 */
export default function NotFound() {
  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2 text-center flex flex-col items-center gap-6">
      <Compass class="size-16 text-orange" />
      <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
        Page not found
      </h1>
      <p class="text-sm md:text-base text-foreground3">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <A
        href="/"
        class="px-4 py-2 rounded-md bg-linear-to-r from-green to-orange cursor-pointer font-bold"
      >
        Back to Home
      </A>
    </main>
  );
}
