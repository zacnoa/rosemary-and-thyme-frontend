import { API_URL } from "~/utils/apiUrl";

type RecipeResult = { first: string; second: string };

export const searchRecipes = async (q: string): Promise<RecipeResult[]> => {
  const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
  const result = await fetch(`${API_URL}/user/recipes/search${params}`, {
    credentials: "include",
  });

  if (!result.ok) {
    return [];
  }

  return result.json();
};
