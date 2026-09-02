import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { Recipe } from "~/model/interfaces/Recipe";
import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the getRecipe function.
 */
export const getRecipe = query(async (id: string) => {

  "use server"
  //get current request that is being handled
  const event = getRequestEvent();
  const cookie = event?.locals.sessionCookie ?? ""



  const response = await fetch(`${API_URL}/recipe/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", cookie: `session_cookie=${cookie}` },
  });

  if (response.status === 404) {
    throw redirect(`/recipe/${id}/not-found`);
  }

  if (!response.ok) {
    throw new Error("Failed recipe fetch:" + response.status + response.statusText);
  }

  const recipe = await response.json()

  return {
    ...recipe,
    createDate: new Date(recipe.createDate),
  } as Recipe;
}, "recipe")


