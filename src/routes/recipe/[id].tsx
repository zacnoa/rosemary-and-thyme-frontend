import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/BlogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";
import { getRecipe } from "~/queries/getRecipe";
import { useAuth } from "~/components/auth/context/useAuth";


//BFF patten --> our SSR server extracts session_cookie and forwards it to our backend

//TODO :add network error specific message


export default function RecipeEditor() {
  const params = useParams();
  const user = useAuth();

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
            <Switch>
              <Match when={user?.id === data().userId}>
                <RecipeProvider initialRecipe={data()}>
                  <RecipeEditorContent />
                </RecipeProvider>
              </Match>
              <Match when={true}>
                <BlogProvider recipe={data()}>
                  <Blog />
                </BlogProvider>
              </Match>
            </Switch>
          )}
        </Show>

      </Suspense>
    </ErrorBoundary>
  );
}
