import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { Recipe } from "~/model/interfaces/Recipe";
import { API_URL } from "~/utils/apiUrl";

/**
 * Fetches a recipe by id, server-side only (`"use server"`) - called from
 * routes/recipe/[id].tsx via `createAsync`. Same BFF reasoning as
 * queries/getUser.ts: forwards the session cookie manually since this is a
 * server-to-server call to a different origin (needed here because
 * `GET /recipe/{id}` also works for anonymous viewers, but returning the
 * *owner's* edit rights depends on who's logged in - see the
 * owner-vs-visitor `<Switch>` in routes/recipe/[id].tsx).
 *
 * @param id the recipe's id
 * @returns the recipe, with `createDate` converted from the wire's ISO
 * string to a real `Date` (see model/interfaces/Recipe.ts)
 * @throws a redirect to `/recipe/{id}/not-found` on 404, or a plain `Error`
 * for any other non-2xx response
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


