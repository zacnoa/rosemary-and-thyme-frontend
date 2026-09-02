import { API_URL } from "~/utils/apiUrl";
import type { RecipeFeed } from "~/model/interfaces/RecipeFeed";
import type { FeedPage } from "~/model/interfaces/FeedPage";

/**
 * Defines the RecipeFeedWire type.
 */
type RecipeFeedWire = Omit<RecipeFeed, "createDate"> & { createDate: string };

/**
 * Provides the getLikedRecipes function.
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
