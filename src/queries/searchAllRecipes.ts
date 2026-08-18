import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";

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
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend returns its top-100-by-likes
 * listing unfiltered
 * @returns matching recipes as feed cards, or `[]` on any non-2xx response (errors
 * are swallowed here rather than surfaced - same reasoning as searchRecipes.ts,
 * there's no dedicated error UI for a search bar)
 */
export const searchAllRecipes = async (q: string): Promise<RecipeFeed[]> => {
  const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const result = await fetch(`${API_URL}/recipe/search${params}`, {
    credentials: "include",
  });

  if (!result.ok) {
    return [];
  }

  const recipes: RecipeFeedWire[] = await result.json();
  return recipes.map((recipe) => ({ ...recipe, createDate: new Date(recipe.createDate) }));
};
