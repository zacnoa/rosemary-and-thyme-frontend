import { LoaderCircle } from "lucide-solid";

/**
 * Provides the Loading function.
 */
export default function Loading() {
  return (
    <div class="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
      <LoaderCircle class="size-10 md:size-14 animate-spin text-orange" />
      <p class="text-sm md:text-base text-foreground3">Loading...</p>
    </div>
  );
}
