import { API_URL } from "~/utils/apiUrl";

export const putRecipe = async (id: string, formData: FormData) => {
  const result = await fetch(`${API_URL}/recipe/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData
    //sluzi za odvajanje vrsta podataka
    // NE setaš Content-Type, browser sam postavi boundary
  });

  const json = await result.json();

  return { ok: result.ok, json };
};
