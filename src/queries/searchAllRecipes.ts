import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/** The wire shape of `RecipeFeed` - `createDate` hasn't been revived from its ISO string yet. */
type RecipeFeedWire = Omit<RecipeFeed, "createDate"> & { createDate: string };

/**
 * Searches recipes across *all* users by name via `GET /recipe/search`, ordered by
 * like count (most-liked first) rather than name relevance - this is the "browse
 * popular recipes" endpoint behind the home page's global recipe feed (see
 * components/home/RecipeSearch.tsx / RecipePost.tsx), not the "find one of my own
 * recipes" one (see queries/searchRecipes.ts / SearchModule, which stays
 * name-relevance ordered, scoped to the signed-in user's own recipes, and returns
 * just (id, name) rather than a full feed card).
 *
 * Public endpoint - no `credentials: "include"` needed for it to work, but it's
 * included anyway so a signed-in visitor gets the exact same request shape as
 * every other query in this module, rather than this one silently being the odd
 * one out.
 *
 * Cursor-paginated - see components/common/VirtualFeed.tsx, the only caller (via
 * components/home/RecipeSearch.tsx), for how [cursor] and the returned
 * `nextCursor` are used.
 *
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend returns its top-liked
 * listing unfiltered
 * @param cursor an earlier call's own `nextCursor`, or `null` for the first page
 * @returns one page of matching recipes as feed cards
 * @throws if the request fails (network error or non-2xx response) - left to
 * VirtualFeed to catch, unlike this file's pre-pagination version, which used to
 * swallow errors into `[]` itself since there was no per-page error state to show
 */
export const searchAllRecipes = async (q: string, cursor: string | null): Promise<FeedPage<RecipeFeed>> => {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();

  const result = await fetch(`${API_URL}/recipe/search${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });

  if (!result.ok) {
    throw new Error("Failed to search recipes");
  }

  const page: FeedPage<RecipeFeedWire> = await result.json();
  return {
    items: page.items.map((recipe) => ({ ...recipe, createDate: new Date(recipe.createDate) })),
    nextCursor: page.nextCursor,
  };
};
