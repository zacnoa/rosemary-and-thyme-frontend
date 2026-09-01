import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import { getLikedRecipes } from "~/queries/getLikedRecipes";
import VirtualFeed, { type VirtualFeedHandle } from "~/components/common/VirtualFeed";
import LikedRecipeCard from "./LikedRecipeCard";

/**
 * Dashboard's "Liked Recipes" section: every recipe the signed-in caller has liked
 * (see queries/getLikedRecipes.ts), most recently liked first, each rendered as a
 * LikedRecipeCard (the same RecipePost card used everywhere else, plus an unlike
 * slider) inside a <VirtualFeed/> (cursor-paginated infinite scroll - see that
 * component). Sits below components/dashboard/RecipeSearch.tsx ("My Recipes") as
 * its own independently-scrollable box - kept as two separate boxes rather than one
 * combined list since "recipes I made" and "recipes I liked" are different
 * collections with different actions available on each (toggle/delete vs. unlike),
 * and a name filter only makes sense for the (potentially much larger, searchable
 * by name) "My Recipes" list - there's no search box here to match.
 *
 * No `resetKey` passed to VirtualFeed (unlike RecipeSearch.tsx) - the backend
 * endpoint this calls has no name filter at all (see
 * RecipeRepository.selectLikedRecipeFeed), so there's nothing that would ever need
 * to restart the feed from its first page; it still loads once on mount either way.
 *
 * `feedHandle` is how LikedRecipeCard's onUnliked reaches into VirtualFeed's own
 * internally-held list - see VirtualFeedHandle's KDoc.
 */
export default function LikedRecipes() {
  let feedHandle: VirtualFeedHandle<RecipeFeed> | undefined;

  /** The unlike already happened server-side by the time this fires (see LikedRecipeCard.confirmUnlike). */
  const onUnliked = (id: UUID) => feedHandle?.remove(id);

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-fluid-lg-2xl font-bold">Liked Recipes</h2>
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
