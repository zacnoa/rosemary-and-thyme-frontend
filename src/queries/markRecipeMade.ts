import { API_URL } from "~/utils/apiUrl";

/** Defines the successful response from POST /recipe/{id}/made. */
export type MadeStatus = { timesMade: number };

/** Records one completed preparation of a recipe. */
export const markRecipeMade = async (id: string) => {
  const result = await fetch(`${API_URL}/recipe/${id}/made`, {
    method: "POST",
    credentials: "include",
  });

  const json = await result.json().catch(() => ({})) as MadeStatus & { detail?: string };
  return { ok: result.ok, status: result.status, json };
};
