import { createSignal } from "solid-js";
import { getLikedRecipes } from "~/queries/getLikedRecipes";
import { searchUserFeed } from "~/queries/searchUserFeed";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import VirtualFeed, { type VirtualFeedHandle } from "~/components/common/VirtualFeed";
import DashboardRecipeCard from "./DashboardRecipeCard";
import LikedRecipeCard from "./LikedRecipeCard";

type RecipeFeedTab = "my" | "liked";

/** Renders the current user's recipes or recipes they have liked in one feed. */
export default function DashboardRecipeFeed() {
  const [activeTab, setActiveTab] = createSignal<RecipeFeedTab>("my");
  const [query, setQuery] = createSignal("");
  const [debouncedQuery, setDebouncedQuery] = createSignal(query());

  let debounceId: ReturnType<typeof setTimeout> | undefined;
  let feedHandle: VirtualFeedHandle<RecipeFeed> | undefined;

  const onInput = (value: string) => {
    setQuery(value);
    clearTimeout(debounceId);
    debounceId = setTimeout(() => setDebouncedQuery(value), 300);
  };

  /** Removes a recipe after a successful deletion or unlike action. */
  const removeRecipe = (id: UUID) => feedHandle?.remove(id);

  /** Updates the visible privacy state after a successful ownership action. */
  const onPrivacyChange = (id: UUID, isPrivate: boolean) =>
    feedHandle?.patch(id, (recipe) => ({ ...recipe, isPrivate }));

  return (
    <div class="flex flex-col gap-3">
      <div class="flex gap-2" aria-label="Recipe feed">
        <button
          type="button"
          aria-pressed={activeTab() === "my"}
          onClick={() => setActiveTab("my")}
          class="px-3 py-1.5 rounded-full border-2 border-foreground3 text-xs md:text-sm cursor-pointer aria-pressed:bg-foreground aria-pressed:text-background"
        >
          My Recipes
        </button>
        <button
          type="button"
          aria-pressed={activeTab() === "liked"}
          onClick={() => setActiveTab("liked")}
          class="px-3 py-1.5 rounded-full border-2 border-foreground3 text-xs md:text-sm cursor-pointer aria-pressed:bg-foreground aria-pressed:text-background"
        >
          Liked Recipes
        </button>
      </div>

      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-sm md:text-base"
        placeholder={activeTab() === "my" ? "Search your recipes" : "Search liked recipes"}
      />

      <VirtualFeed<RecipeFeed>
        ref={(handle) => (feedHandle = handle)}
        resetKey={`${activeTab()}:${debouncedQuery()}`}
        fetchPage={(cursor) =>
          activeTab() === "my"
            ? searchUserFeed(debouncedQuery(), cursor)
            : getLikedRecipes(debouncedQuery(), cursor)
        }
        getId={(recipe) => recipe.id}
        renderItem={(recipe) =>
          activeTab() === "my" ? (
            <DashboardRecipeCard recipe={recipe} onDeleted={removeRecipe} onPrivacyChange={onPrivacyChange} />
          ) : (
            <LikedRecipeCard recipe={recipe} onUnliked={removeRecipe} />
          )
        }
        loadingMessage={activeTab() === "my" ? "Searching..." : "Loading..."}
        emptyMessage={activeTab() === "my" ? "No recipes found" : "No liked recipes yet"}
        class="max-h-[60vh] overflow-y-auto pr-1"
      />
    </div>
  );
}
