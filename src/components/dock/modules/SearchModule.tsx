import { Search } from "lucide-solid";
import { createSignal, For, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useDock } from "../context/DockContext";
import { searchAllRecipes } from "~/queries/searchAllRecipes";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";

const PANEL_ID = "search";

/**
 * Search panel over *every* user's recipes - the dock bar's own search icon is
 * present on every dock configuration (Home/Blog/Editor), so it needs to behave the
 * way a bare "search" icon in a dock intuitively reads: search everything, not just
 * whatever's signed in. Backed by the same public `GET /recipe/search` endpoint as
 * the home page's feed (queries/searchAllRecipes.ts) - no sign-in required, unlike
 * the old `searchUserRecipes`/`GET /user/recipes/search` this used to call.
 *
 * The "my own recipes only" search lives on the dashboard instead (see
 * components/dashboard/RecipeSearch.tsx / queries/searchUserFeed.ts) - that one's
 * scoping is just as intuitive, since the whole page is already "your recipes".
 *
 * Debounced (300ms) rather than searching on every keystroke, same reasoning and
 * timing as the dashboard/home page searches.
 */
export default function SearchModule() {
  const { toggle, activePanel, registerPanel } = useDock();
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<RecipeFeed[]>([]);
  const [loading, setLoading] = createSignal(false);

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const search = async (q: string) => {
    setLoading(true);
    setResults(await searchAllRecipes(q));
    setLoading(false);
  };

  /** Debounces `search()` by 300ms - resets the timer on every call, so only the last keystroke in a burst actually fires a request. */
  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(value), 300);
  };

  /** Runs an immediate (non-debounced) search with whatever query is already typed each time the panel is freshly opened, so reopening shows results right away instead of an empty list until the next keystroke. */
  const handleToggle = () => {
    const wasOpen = activePanel() === PANEL_ID;
    toggle(PANEL_ID);
    if (!wasOpen) search(query());
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <div class="flex flex-col gap-3 text-background">
        <input
          type="text"
          value={query()}
          onInput={(e) => onInput(e.currentTarget.value)}
          class="w-full p-2 text-background border-2 rounded-2xl border-background outline-none bg-transparent"
          placeholder="Search all recipes"
        />
        <ul class="flex flex-col gap-2">
          <Show
            when={!loading()}
            fallback={<li class="text-sm opacity-70">Searching...</li>}
          >
            <Show
              when={results().length > 0}
              fallback={<li class="text-sm opacity-70">No recipes found</li>}
            >
              <For each={results()}>
                {(recipe) => (
                  <li class="border-b-2 border-background pb-1">
                    <A href={`/recipe/${recipe.id}`} class="text-fluid-sm-base">
                      {recipe.name}
                    </A>
                  </li>
                )}
              </For>
            </Show>
          </Show>
        </ul>
      </div>
    ));
  });

  return (
    <li
      class={`rounded-md p-1 cursor-pointer ${activePanel() === PANEL_ID ? "bg-orange" : "bg-foreground"
        }`}
      onClick={handleToggle}
    >
      <Search color="var(--color-background)" class="md:w-[30px] h-auto" />
    </li>
  );
}
