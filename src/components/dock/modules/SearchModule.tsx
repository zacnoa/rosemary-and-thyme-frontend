import { Search } from "lucide-solid";
import { createSignal, For, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useDock } from "../context/DockContext";

const PANEL_ID = "search";

type RecipeResult = { first: string; second: string };

export default function SearchModule() {
  const { toggle, activePanel, registerPanel } = useDock();
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<RecipeResult[]>([]);
  const [loading, setLoading] = createSignal(false);

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const search = async (q: string) => {
    setLoading(true);
    const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    const result = await fetch(`http://localhost:8080/user/recipes/search${params}`, {
      credentials: "include",
    });
    setLoading(false);

    if (!result.ok) {
      setResults([]);
      return;
    }
    setResults(await result.json());
  };

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => search(value), 300);
  };

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
