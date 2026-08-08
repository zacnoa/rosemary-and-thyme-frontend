import { Search } from "lucide-solid";
import { createSignal, For, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useDock } from "../context/DockContext";
import { searchRecipes } from "~/queries/searchRecipes";
import { useAuth } from "~/components/auth/context/useAuth";

const PANEL_ID = "search";

type RecipeResult = { first: string; second: string };

export default function SearchModule() {
  const { toggle, activePanel, registerPanel } = useDock();
  const user = useAuth();
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<RecipeResult[]>([]);
  const [loading, setLoading] = createSignal(false);

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const search = async (q: string) => {
    setLoading(true);
    setResults(await searchRecipes(q));
    setLoading(false);
  };

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(value), 300);
  };

  const handleToggle = () => {
    const wasOpen = activePanel() === PANEL_ID;
    toggle(PANEL_ID);
    // signed-out visitors get a static message instead - the search endpoint
    // needs a session, so there's nothing to fetch here
    if (!wasOpen && user) search(query());
  };

  onMount(() => {
    registerPanel(PANEL_ID, () => (
      <Show
        when={user}
        fallback={
          <p class="text-sm text-background opacity-80">
            This is where your own recipes show up once you're signed in -{" "}
            <A href="/auth/login" class="underline">log in</A> to search them.
          </p>
        }
      >
        <div class="flex flex-col gap-3 text-background">
          <input
            type="text"
            value={query()}
            onInput={(e) => onInput(e.currentTarget.value)}
            class="w-full p-2 text-background border-2 rounded-2xl border-background outline-none bg-transparent"
            placeholder="Search your recipes"
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
                      <A href={`/recipe/${recipe.first}`} class="text-sm md:text-base">
                        {recipe.second}
                      </A>
                    </li>
                  )}
                </For>
              </Show>
            </Show>
          </ul>
        </div>
      </Show>
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
