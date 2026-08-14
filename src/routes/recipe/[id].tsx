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
 *
 * `<Show keyed>` below, not a plain `<Show>`: both RecipeProvider and
 * BlogProvider seed their store from their `initialRecipe`/`recipe` prop
 * exactly once, via `createStore(props.initialRecipe)` in their own setup -
 * that's a one-time read, not a reactive binding. A non-keyed `<Show>` only
 * re-invokes its children when `when`'s *truthiness* changes, so navigating
 * from one already-open recipe straight to another (e.g. via SearchModule,
 * while staying on this same route) would keep the same RecipeProvider/
 * BlogProvider instance mounted and just hand it a new `data()` value it
 * never actually reads again - `params.id` and the underlying fetch would
 * update correctly, but the editor/blog view would silently keep showing
 * the first recipe. `keyed` re-invokes the children (so a fresh
 * RecipeProvider/BlogProvider mounts and reseeds its store) whenever the
 * *value* itself changes - which every navigation to a different id causes,
 * since createAsync/getRecipe returns a new object each fetch. Saving the
 * currently-open recipe doesn't refetch this query (see
 * RecipeProvider.applyServerRecipe, which reconciles the store directly
 * instead), so this won't cause an unwanted remount mid-edit.
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
