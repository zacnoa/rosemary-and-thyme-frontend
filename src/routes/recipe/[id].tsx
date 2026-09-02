import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/BlogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";
import { getRecipe } from "~/queries/getRecipe";
import { useAuth } from "~/components/auth/context/useAuth";
import Loading from "~/components/Loading";
import ServerError from "~/components/error/ServerError";


/**
 * Provides the RecipeEditor function.
 */
export default function RecipeEditor() {
  const params = useParams();
  const user = useAuth();

  const recipe = createAsync(() =>
    getRecipe(params.id!!)
  );

  return (
    <ErrorBoundary fallback={() => <ServerError />}>
      <Suspense fallback={<Loading />}>
        <Show when={recipe()} keyed>
          {(data) => (
            <Switch>
              <Match when={user?.id === data.userId}>
                <RecipeProvider initialRecipe={data}>
                  <RecipeEditorContent />
                </RecipeProvider>
              </Match>
              <Match when={true}>
                <BlogProvider recipe={data}>
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
