import { createSignal } from "solid-js";
import { searchAllRecipes } from "~/queries/searchAllRecipes";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import VirtualFeed from "~/components/common/VirtualFeed";
import RecipePost from "./RecipePost";

/**
 * Provides the RecipeSearch function.
 */
export default function RecipeSearch(props: { initialQuery?: string }) {
  const [query, setQuery] = createSignal(props.initialQuery ?? "");
  const [debouncedQuery, setDebouncedQuery] = createSignal(query());

  let debounceId: ReturnType<typeof setTimeout> | undefined;

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => setDebouncedQuery(value), 300);
  };

  return (
    <div class="flex flex-col gap-3">
      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-sm md:text-base"
        placeholder="Search all recipes"
      />
      <VirtualFeed<RecipeFeed>
        resetKey={debouncedQuery()}
        fetchPage={(cursor) => searchAllRecipes(debouncedQuery(), cursor)}
        getId={(recipe) => recipe.id}
        renderItem={(recipe) => <RecipePost recipe={recipe} />}
        loadingMessage="Searching..."
        emptyMessage="No recipes found"
      />
    </div>
  );
}
