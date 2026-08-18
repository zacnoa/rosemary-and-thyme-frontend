import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";

/** The wire shape of `RecipeFeed` - `createDate` hasn't been revived from its ISO string yet. */
type RecipeFeedWire = Omit<RecipeFeed, "createDate"> & { createDate: string };

/**
 * Searches the signed-in user's own recipes by name via `GET /user/recipes/feed`,
 * returned as full feed cards - the dashboard's counterpart of
 * queries/searchAllRecipes.ts (home page's global feed), reusing the same backend
 * projection (`RecipeService.searchRecipeFeed`) scoped to just this caller and kept
 * in alphabetical/relevance order rather than by likes (see UserController.searchUserFeed).
 *
 * Requires a session (`credentials: "include"`) - see components/dashboard/RecipeSearch.tsx,
 * the only caller, which only ever renders on the login-gated /dashboard route.
 *
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend returns every one of the
 * caller's recipes unfiltered
 * @returns matching recipes as feed cards, or `[]` on any non-2xx response (errors
 * are swallowed here rather than surfaced - same reasoning as searchAllRecipes.ts,
 * there's no dedicated error UI for a search bar)
 */
export const searchUserFeed = async (q: string): Promise<RecipeFeed[]> => {
  const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const result = await fetch(`${API_URL}/user/recipes/feed${params}`, {
    credentials: "include",
  });

  if (!result.ok) {
    return [];
  }

  const recipes: RecipeFeedWire[] = await result.json();
  return recipes.map((recipe) => ({ ...recipe, createDate: new Date(recipe.createDate) }));
};
