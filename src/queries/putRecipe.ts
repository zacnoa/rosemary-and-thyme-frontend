import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the putRecipe function.
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
