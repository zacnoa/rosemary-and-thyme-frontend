import { UUID } from "~/model/types/UUID";
import { API_URL } from "~/utils/apiUrl";

/**
 * Toggles a recipe's private/public flag via `PATCH /recipe/{id}/private`, called
 * directly from the browser - same reasoning as queries/likeRecipe.ts: this always
 * runs in response to a click already happening client-side (the dashboard's
 * private/public toggle, see components/dashboard/DashboardRecipeCard.tsx), so
 * `credentials: "include"` is enough for the session cookie to be sent.
 *
 * The backend rejects both a logged-out caller and a non-owner (see
 * RecipeService.setRecipePrivate) with a non-2xx response; the caller here is
 * expected to only ever call this from the dashboard, which only ever lists the
 * signed-in caller's own recipes, so there's no special-case handling for either -
 * just `ok` like queries/deleteRecipe.ts.
 *
 * @param id the recipe's id
 * @param isPrivate the desired new value
 * @returns `true` on a 2xx response, `false` otherwise
 */
export const setRecipePrivate = async (id: UUID, isPrivate: boolean): Promise<boolean> => {
  const result = await fetch(`${API_URL}/recipe/${id}/private`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPrivate }),
  });

  return result.ok;
};
