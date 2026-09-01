import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/** The wire shape of `RecipeFeed` - `createDate` hasn't been revived from its ISO string yet. */
type RecipeFeedWire = Omit<RecipeFeed, "createDate"> & { createDate: string };

/**
 * Fetches the signed-in user's liked recipes via `GET /user/recipes/liked`, as full
 * feed cards - the dashboard's "Liked Recipes" section, counterpart of
 * queries/searchUserFeed.ts (the caller's *own* recipes). No name filter - the liked
 * section has no search box, see components/dashboard/LikedRecipes.tsx.
 *
 * Requires a session (`credentials: "include"`) - only ever called from the
 * login-gated `/dashboard` route.
 *
 * Cursor-paginated - see components/common/VirtualFeed.tsx for how [cursor] and the
 * returned `nextCursor` are used.
 *
 * @param cursor an earlier call's own `nextCursor`, or `null` for the first page
 * @returns one page of liked recipes as feed cards, most recently liked first
 * @throws if the request fails (network error or non-2xx response) - left to
 * VirtualFeed to catch
 */
export const getLikedRecipes = async (cursor: string | null): Promise<FeedPage<RecipeFeed>> => {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();

  const result = await fetch(`${API_URL}/user/recipes/liked${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });

  if (!result.ok) {
    throw new Error("Failed to fetch liked recipes");
  }

  const page: FeedPage<RecipeFeedWire> = await result.json();
  return {
    items: page.items.map((recipe) => ({ ...recipe, createDate: new Date(recipe.createDate) })),
    nextCursor: page.nextCursor,
  };
};
