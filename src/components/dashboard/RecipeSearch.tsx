import { createSignal, For, onMount, Show } from "solid-js";
import { searchUserFeed } from "~/queries/searchUserFeed";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import DashboardRecipeCard from "./DashboardRecipeCard";

/**
 * Dashboard's recipe list: a name filter over the signed-in caller's *own* recipes
 * only (see queries/searchUserFeed.ts), each rendered as a DashboardRecipeCard (the
 * same RecipePost card the home feed uses, plus a delete control) - the dashboard's
 * counterpart of components/home/RecipeSearch.tsx, which browses every user's
 * recipes instead of just this one's.
 *
 * Debounced (300ms) rather than searching on every keystroke, same reasoning and
 * timing as the dock's SearchModule and the home page's RecipeSearch.
 */
export default function RecipeSearch() {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<RecipeFeed[]>([]);
  const [loading, setLoading] = createSignal(false);

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const search = async (q: string) => {
    setLoading(true);
    setResults(await searchUserFeed(q));
    setLoading(false);
  };

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(value), 300);
  };

  /** Drops a deleted recipe from the currently shown list without refetching - the delete already happened server-side by the time this fires (see DashboardRecipeCard.confirmDelete). */
  const onDeleted = (id: UUID) => {
    setResults((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  // Runs once on mount with the (empty) query, so the page shows every one of the
  // caller's recipes immediately instead of a blank list until they type something.
  onMount(() => search(query()));

  return (
    <div class="flex flex-col gap-3">
      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-fluid-sm-base"
        placeholder="Search your recipes"
      />
      <div class="flex flex-col gap-3">
        <Show
          when={!loading()}
          fallback={<p class="text-sm text-foreground3">Searching...</p>}
        >
          <Show
            when={results().length > 0}
            fallback={<p class="text-sm text-foreground3">No recipes found</p>}
          >
            <For each={results()}>
              {(recipe) => <DashboardRecipeCard recipe={recipe} onDeleted={onDeleted} />}
            </For>
          </Show>
        </Show>
      </div>
    </div>
  );
}
