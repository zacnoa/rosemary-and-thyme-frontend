import { API_URL } from "~/utils/apiUrl";

/**
 * `{first, second}` rather than `{id, name}` because the backend returns a
 * Kotlin `Pair<UUID, String>` (see RecipeController.searchRecipes /
 * UserController.searchOwnRecipes), which Jackson serializes using those
 * generic property names rather than domain-specific ones.
 */
type RecipeResult = { first: string; second: string };

/**
 * Searches the signed-in user's own recipes by name via
 * `GET /user/recipes/search` (requires a session - see SearchModule, the
 * only caller, which only renders this panel for signed-in users).
 *
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend falls back to its
 * unfiltered/alphabetical listing (see RecipeRepository.selectRecipesWithFilters)
 * @returns matching recipes, or `[]` on any non-2xx response (errors are
 * swallowed here rather than surfaced - there's no error UI in the search panel)
 */
export const searchUserRecipes = async (q: string): Promise<RecipeResult[]> => {
  const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const result = await fetch(`${API_URL}/user/recipes/search${params}`, {
    credentials: "include",
  });

  if (!result.ok) {
    return [];
  }

  return result.json();
};
