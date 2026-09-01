import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { FeedPage } from "~/model/interfaces/FeedPage";

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
 * Cursor-paginated - see components/common/VirtualFeed.tsx for how [cursor] and the
 * returned `nextCursor` are used.
 *
 * @param q the fuzzy name filter; an empty/blank string omits the `q` param
 * entirely rather than sending `q=`, so the backend returns every one of the
 * caller's recipes unfiltered
 * @param cursor an earlier call's own `nextCursor`, or `null` for the first page
 * @returns one page of matching recipes as feed cards
 * @throws if the request fails (network error or non-2xx response) - left to
 * VirtualFeed to catch
 */
export const searchUserFeed = async (q: string, cursor: string | null): Promise<FeedPage<RecipeFeed>> => {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();

  const result = await fetch(`${API_URL}/user/recipes/feed${qs ? `?${qs}` : ""}`, {
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
