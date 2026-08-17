import { API_URL } from "~/utils/apiUrl";

/** Mirrors the backend's LikeStatusDTO - see RecipeController.likeRecipe/unlikeRecipe. */
export type LikeStatus = { liked: boolean; likes: number };

/**
 * Likes/unlikes a recipe via `POST`/`DELETE /recipe/{id}/like`, called directly from
 * the browser - same reasoning as queries/loginUser.ts and queries/putRecipe.ts:
 * this always runs in response to a click already happening client-side, so
 * `credentials: "include"` is enough for the session cookie to be sent, no BFF
 * forwarding needed.
 *
 * The backend rejects both a logged-out caller (not `permitAll` - see
 * SecurityConfig) and the recipe's own owner (see RecipeService.likeRecipe) with a
 * non-2xx response; the caller here is expected to have already ruled out both cases
 * before calling this (see BlogProvider.toggleLike - a logged-out click never
 * reaches this function at all, and the like button structurally never renders for
 * a recipe's owner in the first place, see routes/recipe/[id].tsx), so this
 * intentionally has no special-case handling for either - just `ok`/status like the
 * rest of this module's siblings.
 *
 * @param id the recipe's id
 * @param liked the desired end state - `true` to like, `false` to unlike
 * @returns `ok` from the response and the parsed body (`json`) either way
 */
export const setRecipeLiked = async (id: string, liked: boolean) => {
  const result = await fetch(`${API_URL}/recipe/${id}/like`, {
    method: liked ? "POST" : "DELETE",
    credentials: "include",
  });

  const json = await result.json();

  return { ok: result.ok, json: json as LikeStatus };
};
