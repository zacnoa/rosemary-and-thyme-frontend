import { createSignal, For, onMount, Show } from "solid-js";
import { searchAllRecipes } from "~/queries/searchAllRecipes";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import RecipePost from "./RecipePost";

/**
 * Home page's recipe feed: a name filter over *all* users' recipes, ordered by like
 * count (see queries/searchAllRecipes.ts), each rendered as a RecipePost card - fills
 * the space under the title that used to be empty, and doubles as a "what's popular"
 * landing feed for a visitor with nothing specific in mind (see the immediate
 * `onMount` search below).
 *
 * `initialQuery` seeds both the input and the first search - it's how the dock's
 * SearchModule hands off a query typed elsewhere: that module just navigates to
 * `/?query=...` rather than rendering its own results, and routes/index.tsx passes
 * the `query` search param straight through as this prop, so landing here from the
 * dock shows results immediately instead of an empty input.
 *
 * Debounced (300ms) rather than searching on every keystroke, same reasoning and
 * timing as the dock's SearchModule used to have.
 */
export default function RecipeSearch(props: { initialQuery?: string }) {
  const [query, setQuery] = createSignal(props.initialQuery ?? "");
  const [results, setResults] = createSignal<RecipeFeed[]>([]);
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

  // Runs once on mount with whatever query we started with (empty, or seeded from
  // `initialQuery`), so the page shows either the top-100 most-liked recipes or the
  // handed-off search's results immediately, instead of a blank list until the
  // visitor types something.
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
              {(recipe) => <RecipePost recipe={recipe} />}
            </For>
          </Show>
        </Show>
      </div>
    </div>
  );
}
