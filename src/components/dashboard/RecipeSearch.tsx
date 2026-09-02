import { createSignal } from "solid-js";
import { searchUserFeed } from "~/queries/searchUserFeed";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import VirtualFeed, { type VirtualFeedHandle } from "~/components/common/VirtualFeed";
import DashboardRecipeCard from "./DashboardRecipeCard";

/**
 * Provides the RecipeSearch function.
 */
export default function RecipeSearch() {
  const [query, setQuery] = createSignal("");
  const [debouncedQuery, setDebouncedQuery] = createSignal(query());

  let debounceId: ReturnType<typeof setTimeout> | undefined;
  let feedHandle: VirtualFeedHandle<RecipeFeed> | undefined;

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => setDebouncedQuery(value), 300);
  };

  /**
 * Provides the onDeleted function.
 */
  const onDeleted = (id: UUID) => feedHandle?.remove(id);

  /**
 * Provides the onPrivacyChange function.
 */
  const onPrivacyChange = (id: UUID, isPrivate: boolean) =>
    feedHandle?.patch(id, (recipe) => ({ ...recipe, isPrivate }));

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-lg md:text-2xl font-bold">My Recipes</h2>
      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-sm md:text-base"
        placeholder="Search your recipes"
      />
      <VirtualFeed<RecipeFeed>
        ref={(handle) => (feedHandle = handle)}
        resetKey={debouncedQuery()}
        fetchPage={(cursor) => searchUserFeed(debouncedQuery(), cursor)}
        getId={(recipe) => recipe.id}
        renderItem={(recipe) => (
          <DashboardRecipeCard recipe={recipe} onDeleted={onDeleted} onPrivacyChange={onPrivacyChange} />
        )}
        loadingMessage="Searching..."
        emptyMessage="No recipes found"
        class="max-h-[60vh] overflow-y-auto pr-1"
      />
    </div>
  );
}
