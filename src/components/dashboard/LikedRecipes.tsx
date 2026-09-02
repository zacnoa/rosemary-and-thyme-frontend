import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import { getLikedRecipes } from "~/queries/getLikedRecipes";
import VirtualFeed, { type VirtualFeedHandle } from "~/components/common/VirtualFeed";
import LikedRecipeCard from "./LikedRecipeCard";

/**
 * Provides the LikedRecipes function.
 */
export default function LikedRecipes() {
  let feedHandle: VirtualFeedHandle<RecipeFeed> | undefined;

  /**
 * Provides the onUnliked function.
 */
  const onUnliked = (id: UUID) => feedHandle?.remove(id);

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-lg md:text-2xl font-bold">Liked Recipes</h2>
      <VirtualFeed<RecipeFeed>
        ref={(handle) => (feedHandle = handle)}
        fetchPage={(cursor) => getLikedRecipes(cursor)}
        getId={(recipe) => recipe.id}
        renderItem={(recipe) => <LikedRecipeCard recipe={recipe} onUnliked={onUnliked} />}
        loadingMessage="Loading..."
        emptyMessage="No liked recipes yet"
        class="max-h-[60vh] overflow-y-auto pr-1"
      />
    </div>
  );
}
