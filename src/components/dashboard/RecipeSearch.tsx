import { createSignal } from "solid-js";
import { searchUserFeed } from "~/queries/searchUserFeed";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { UUID } from "~/model/types/UUID";
import VirtualFeed, { type VirtualFeedHandle } from "~/components/common/VirtualFeed";
import DashboardRecipeCard from "./DashboardRecipeCard";

/**
 * Dashboard's "My Recipes" section: a name filter over the signed-in caller's *own*
 * recipes only (see queries/searchUserFeed.ts), each rendered as a
 * DashboardRecipeCard (the same RecipePost card the home feed uses, plus a
 * private/public toggle and a delete control) inside a <VirtualFeed/> (cursor-
 * paginated infinite scroll - see that component) - the dashboard's counterpart of
 * components/home/RecipeSearch.tsx, which browses every user's recipes instead of
 * just this one's. Sits alongside components/dashboard/LikedRecipes.tsx (the
 * "Liked Recipes" section) - see that component for why the two are separate,
 * independently-scrollable boxes rather than one combined list.
 *
 * `debouncedQuery` is what actually drives VirtualFeed's `resetKey`/`fetchPage` -
 * see components/home/RecipeSearch.tsx's own KDoc for why (same 300ms debounce,
 * same reasoning, same timing as the dock's SearchModule and the home page).
 *
 * `feedHandle` is how DashboardRecipeCard's onDeleted/onPrivacyChange reach into
 * VirtualFeed's own internally-held list - see VirtualFeedHandle's KDoc - since the
 * fetched pages now live inside VirtualFeed, not in a signal here.
 *
 * Results are capped to a fixed-height, independently `overflow-y-auto` box
 * (`max-h-[60vh]`) once there are more than fit on screen, rather than growing the
 * page - same reasoning as LikedRecipes.tsx, whose box sits right below this one.
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

  /** The delete already happened server-side by the time this fires (see DashboardRecipeCard.confirmDelete). */
  const onDeleted = (id: UUID) => feedHandle?.remove(id);

  /** Same "server already confirmed it" reasoning as onDeleted, just a patch instead of a removal (see DashboardRecipeCard.togglePrivate). */
  const onPrivacyChange = (id: UUID, isPrivate: boolean) =>
    feedHandle?.patch(id, (recipe) => ({ ...recipe, isPrivate }));

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-fluid-lg-2xl font-bold">My Recipes</h2>
      <input
        type="text"
        value={query()}
        onInput={(e) => onInput(e.currentTarget.value)}
        class="w-full p-2 border-2 rounded-2xl border-foreground outline-none bg-transparent text-fluid-sm-base"
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
