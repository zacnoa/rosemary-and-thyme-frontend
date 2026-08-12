import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/BlogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";
import { getRecipe } from "~/queries/getRecipe";
import { useAuth } from "~/components/auth/context/useAuth";
import Loading from "~/components/Loading";


/**
 * BFF pattern: this SSR server extracts the session_cookie and forwards it
 * to the backend itself (see utils/cookiesMiddleware.ts, queries/getRecipe.ts) -
 * the browser never talks to the backend directly for this route.
 *
 * Renders one of two completely different UIs for the same recipe depending
 * on who's looking: the live editor (RecipeProvider + RecipeEditorContent)
 * for the recipe's owner, or the read-only view (BlogProvider + Blog) for
 * anyone else - including a signed-out visitor, since `user` is `null` in
 * that case and `user?.id === data().userId` is simply false. There's no
 * dedicated "forbidden" state for a non-owner trying to edit: they
 * transparently just see the read-only view instead.
 *
 * TODO: add a network-error-specific message - the ErrorBoundary fallback
 * below currently shows the same generic message for a fetch/network
 * failure as for any other unexpected error.
 */
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
      <Suspense fallback={<Loading />}>
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
