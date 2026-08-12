import { API_URL } from "~/utils/apiUrl";

/**
 * Upserts a recipe via `PUT /recipe/{id}` - both "save changes to an
 * existing recipe" (RecipeProvider.saveRecipe) and "create a new one"
 * (CreateRecipeModule) go through this same call.
 *
 * @param id the recipe's id (existing, or a throwaway client-generated one
 * for a brand-new recipe - see CreateRecipeModule for why that's fine)
 * @param formData multipart body: the recipe as a JSON blob under
 * `"recipe"`, plus one binary part per new image, keyed by that image's id -
 * see RecipeProvider.saveRecipe for how this is built
 * @returns `ok` from the response and the parsed body (`json`) either way -
 * on success this is the server-reconciled RecipeDTO (see
 * RecipeProvider.applyServerRecipe), on failure a problem-detail error body
 */
export const putRecipe = async (id: string, formData: FormData) => {
  const result = await fetch(`${API_URL}/recipe/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData
    // Content-Type is deliberately not set here - the browser fills in
    // multipart/form-data with the correct boundary itself; setting it
    // manually would omit that boundary and break parsing server-side.
  });

  const json = await result.json();

  return { ok: result.ok, json };
};
