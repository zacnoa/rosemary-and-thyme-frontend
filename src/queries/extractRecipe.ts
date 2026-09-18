import { API_URL } from "~/utils/apiUrl";

/** Uploads one source image and creates a private editable recipe from it. */
export const extractRecipe = async (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_URL}/recipe/extract`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const json = await response.json().catch(() => ({
    detail: "The server returned an invalid response",
  }));

  return { ok: response.ok, status: response.status, json };
};
