import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { Recipe } from "~/model/interfaces/Recipe";

export const getRecipe = query(async (id: string) => {

  "use server"
  //get current request that is being handled
  const event = getRequestEvent();
  const cookie = event?.locals.sessionCookie ?? ""



  const response = await fetch(`http://localhost:8080/recipe/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", cookie },
  });

  if (!response.ok) {
    throw new Error("Failed recipe fetch:" + response.status + response.statusText);
  }

  const recipe = await response.json()

  return {
    ...recipe,
    createDate: new Date(recipe.createDate),
  } as Recipe;
}, "recipe")


