import { createSignal, For, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { searchAllRecipes } from "~/queries/searchAllRecipes";

type RecipeResult = { first: string; second: string };

/**
 * Home page's recipe browser: a name filter over *all* users' recipes, ordered by
 * like count (see queries/searchAllRecipes.ts) - fills the space under the title
 * that used to be empty, and doubles as a "what's popular" landing list for a
 * visitor with nothing specific in mind (see the immediate `onMount` search below).
 *
 * Debounced (300ms) rather than searching on every keystroke, same reasoning and
 * timing as the dock's SearchModule.
 */
export default function RecipeSearch() {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<RecipeResult[]>([]);
  const [loading, setLoading] = createSignal(false);

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const search = async (q: string) => {
    setLoading(true);
    setResults(await searchAllRecipes(q));
    setLoading(false);
  };

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(value), 300);
  };

  // Runs once on mount with the (empty) query, so the page shows the top-100
  // most-liked recipes immediately instead of a blank list until the visitor
  // types something.
  onMount(() => search(query()));

  return (
    <div class="flex flex-col gap-3">
      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-fluid-sm-base"
        placeholder="Search all recipes"
      />
      <ul class="flex flex-col gap-2">
        <Show
          when={!loading()}
          fallback={<li class="text-sm text-foreground3">Searching...</li>}
        >
          <Show
            when={results().length > 0}
            fallback={<li class="text-sm text-foreground3">No recipes found</li>}
          >
            <For each={results()}>
              {(recipe) => (
                <li class="border-b-2 border-foreground2 pb-1">
                  <A href={`/recipe/${recipe.first}`} class="text-fluid-sm-base">
                    {recipe.second}
                  </A>
                </li>
              )}
            </For>
          </Show>
        </Show>
      </ul>
    </div>
  );
}
