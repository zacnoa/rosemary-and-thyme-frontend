import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/**
 * Defines the RecipeFeedWire type.
 */
type RecipeFeedWire = Omit<RecipeFeed, "createDate"> & { createDate: string };

/**
 * Provides the searchUserFeed function.
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
