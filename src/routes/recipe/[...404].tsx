import { A } from "@solidjs/router";
import { CookingPot } from "lucide-solid";

/**
 * Themed 404 specifically for recipe routes - reached via the
 * `redirect(`/recipe/${id}/not-found`)` in queries/getRecipe.ts when a
 * recipe id doesn't exist (matched by the `[...404]` segment under
 * `/recipe/`, distinct from the generic, unthemed routes/[...404].tsx).
 */
export default function RecipeNotFound() {
  return (
    <main class="md:max-w-md mx-2 md:mx-auto mt-20 px-2 text-center flex flex-col items-center gap-6">
      <CookingPot class="size-16 text-orange" />
      <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
        Recipe not found
      </h1>
      <p class="text-fluid-sm-base text-foreground3">
        The recipe you are looking for doesn't exist or has been removed.
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
