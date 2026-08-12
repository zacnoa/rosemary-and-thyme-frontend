import { LoaderCircle } from "lucide-solid";

/**
 * Generic full-viewport loading state. Meant to be used as a `<Suspense>`
 * fallback anywhere the app is waiting on async route data (see app.tsx's
 * root Suspense and routes/recipe/[id].tsx), so a page never flashes blank
 * or shows raw unstyled text while data is in flight.
 *
 * `fixed inset-0` covers the full viewport regardless of whatever (possibly
 * still-empty) parent container it's rendered into, and it renders fine on
 * the server since it has no client-only dependencies.
 */
export default function Loading() {
  return (
    <div class="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
      <LoaderCircle class="size-10 md:size-14 animate-spin text-orange" />
      <p class="text-fluid-sm-base text-foreground3">Loading...</p>
    </div>
  );
}
