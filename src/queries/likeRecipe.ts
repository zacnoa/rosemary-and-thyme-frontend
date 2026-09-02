import { API_URL } from "~/utils/apiUrl";

/**
 * Defines the LikeStatus type.
 */
export type LikeStatus = { liked: boolean; likes: number };

/**
 * Provides the setRecipeLiked function.
 */
export const setRecipeLiked = async (id: string, liked: boolean) => {
  const result = await fetch(`${API_URL}/recipe/${id}/like`, {
    method: liked ? "POST" : "DELETE",
    credentials: "include",
  });

  const json = await result.json();

  return { ok: result.ok, json: json as LikeStatus };
};
