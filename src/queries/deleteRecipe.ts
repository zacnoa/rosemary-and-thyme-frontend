import { UUID } from "~/model/types/UUID";
import { API_URL } from "~/utils/apiUrl";

/**
 * Deletes a recipe (and its images) via `DELETE /recipe/{id}`, called directly from
 * the browser - same reasoning as queries/likeRecipe.ts: this always runs in response
 * to a click already happening client-side (the dashboard's delete slider - see
 * components/dashboard/DashboardRecipeCard.tsx), so `credentials: "include"` is
 * enough for the session cookie to be sent, no BFF forwarding needed.
 *
 * The backend rejects both a logged-out caller and a non-owner with a non-2xx
 * response (see RecipeController.deleteRecipe / RecipeService.deleteRecipe); the
 * dashboard only ever lists the caller's own recipes, so a non-owner rejection isn't
 * expected in practice, but this still just reports `ok` rather than assuming success.
 * No response body to parse either way - a successful delete is `204 No Content`.
 *
 * @param id the recipe to delete
 * @returns whether the delete succeeded
 */
export const deleteRecipe = async (id: UUID): Promise<boolean> => {
  const result = await fetch(`${API_URL}/recipe/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return result.ok;
};
