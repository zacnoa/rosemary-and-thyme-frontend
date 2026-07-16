import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams, useSearchParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import { Recipe } from "~/model/interfaces/Recipe";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/BlogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";
import { useAuth } from "~/components/auth/context/useAuth";

//TODO :add network error specific message
const getRecipe = query(async (id: string) => {
  const response = await fetch(`http://localhost:8080/recipe/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  console.log("recipe status:", response.status);
  console.log("recipe content-type:", response.headers.get("content-type"));

  const text = await response.text();

  console.log("recipe body:", text);

  if (!response.ok) {
    throw new Error(text || "Failed recipe fetch");
  }

  const json = JSON.parse(text);

  console.log(json);

  return {
    ...json,
    createDate: new Date(json.createDate),
  } as Recipe;
}, "recipe")


export default function RecipeEditor() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useAuth()

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
                <Match when={user === null || user.id != data().userId}>
                  <BlogProvider recipe={data()}>
                    <Blog />
                  </BlogProvider>
                </Match>
                <Match when={user && user.id === data().userId}>
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
