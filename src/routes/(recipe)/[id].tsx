import { ErrorBoundary, Show, Suspense } from "solid-js";
import { createAsync, query, useParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import RecipeProvider from "~/context/recipeState/RecipeProvider";
import { Recipe } from "~/model/interfaces/Recipe";

//TODO: add network error specific message
const getRecipe = query(async (id: string) => {
  const response = await fetch(`http://localhost:8080/recipe/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.detail ?? "Failed recipe fetch")
  }

  const recipe = json.payload
  return {
    ...recipe,
    createDate: new Date(recipe.createDate),
  } as Recipe
}, "recipe")


export default function RecipeEditor() {
  const params = useParams();

  const recipe = createAsync(() =>
    getRecipe(params.id!!)
  );

  return (
    <ErrorBoundary fallback={(err) => (
      <div>Greška: {err.message}</div>
    )}>
      <Suspense fallback={<div>Loading...</div>}>

        <Show when={recipe()}>
          {(data) => (
            <RecipeProvider initialRecipe={data()}>
              <RecipeEditorContent />
            </RecipeProvider>
          )}
        </Show>

      </Suspense>
    </ErrorBoundary>
  );
}
