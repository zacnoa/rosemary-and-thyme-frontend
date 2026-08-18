import { A } from "@solidjs/router";
import { ServerCrash } from "lucide-solid";

/**
 * Themed fallback for an uncaught render/fetch error - same layout/classes as
 * routes/[...404].tsx and routes/recipe/[...404].tsx (icon, heading, message,
 * back-to-home link), just themed around "something broke on our end" instead of
 * "nothing here". Mounted app-wide as app.tsx's `<ErrorBoundary>` fallback, and
 * reused by routes/recipe/[id].tsx's own ErrorBoundary (a failed recipe fetch)
 * instead of duplicating this markup.
 */
export default function ServerError() {
  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2 text-center flex flex-col items-center gap-6">
      <ServerCrash class="size-16 text-orange" />
      <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
        Something went wrong
      </h1>
      <p class="text-fluid-sm-base text-foreground3">
        An unexpected error happened on our end. Please try again in a moment.
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
