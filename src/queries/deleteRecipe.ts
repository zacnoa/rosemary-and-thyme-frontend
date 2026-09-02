import { UUID } from "~/model/types/UUID";
import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the deleteRecipe function.
 */
export const deleteRecipe = async (id: UUID): Promise<boolean> => {
  const result = await fetch(`${API_URL}/recipe/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return result.ok;
};
