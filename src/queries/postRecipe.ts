import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the postRecipe function.
 */
export const postRecipe = async (formData: FormData) => {
  const result = await fetch(`${API_URL}/recipe`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return { ok: result.ok, json: await result.json() };
};
