import { API_URL } from "~/utils/apiUrl";

/**
 * `{first, second}` rather than `{id, name}` because the backend returns a Kotlin
 * `Pair<UUID, String>` (see RecipeController.searchRecipes), which Jackson
 * serializes using those generic property names rather than domain-specific ones -
 * same shape as queries/searchRecipes.ts's RecipeResult.
 */
type RecipeResult = { first: string; second: string };

/**
 * Searches recipes across *all* users by name via `GET /recipe/search`, ordered by
 * like count (most-liked first) rather than name relevance - this is the "browse
 * popular recipes" endpoint behind the home page's search bar (see
 * components/home/RecipeSearch.tsx), not the "find one of my own recipes" one (see
 * queries/searchRecipes.ts / SearchModule, which stays name-relevance ordered and
 * scoped to the signed-in user's own recipes).
 *
 * Public endpoint - no `credentials: "include"` needed for it to work, but it's
 * included anyway so a signed-in visitor gets the exact same request shape as
 * every other query in this module, rather than this one silently being the odd
 * one out.
 *
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend returns its top-100-by-likes
 * listing unfiltered
 * @returns matching recipes, or `[]` on any non-2xx response (errors are
 * swallowed here rather than surfaced - same reasoning as searchRecipes.ts, there's
 * no dedicated error UI for a search bar)
 */
export const searchAllRecipes = async (q: string): Promise<RecipeResult[]> => {
  const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const result = await fetch(`${API_URL}/recipe/search${params}`, {
    credentials: "include",
  });

  if (!result.ok) {
    return [];
  }

  return result.json();
};
