import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams, useSearchParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import { Recipe } from "~/model/interfaces/Recipe";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/blogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";

//TODO :add network error specific message
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
  const [searchParams, setSearchParams] = useSearchParams()

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
            <>
              <Switch fallback={<p>Nema</p>}>
                <Match when={searchParams.edit == "false"}>
                  <BlogProvider recipe={data()}>
                    <Blog />
                  </BlogProvider>
                </Match>
                <Match when={searchParams.edit == "true"}>
                  <RecipeProvider initialRecipe={data()}>
                    <RecipeEditorContent />
                  </RecipeProvider>
                </Match>
              </Switch>

            </>
          )}
        </Show>

      </Suspense>
    </ErrorBoundary>
  );
}
