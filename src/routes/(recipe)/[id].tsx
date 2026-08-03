import { ErrorBoundary, Match, Show, Suspense, Switch } from "solid-js";
import { createAsync, query, useParams } from "@solidjs/router";
import RecipeEditorContent from "~/components/recipeEditor/RecipeEditorContent";
import Blog from "~/components/blog/Blog";
import BlogProvider from "~/components/blog/context/BlogProvider";
import RecipeProvider from "~/components/recipeEditor/context/RecipeProvider";
import { getRecipe } from "~/queries/getRecipe";


//BFF patten --> our SSR server extracts session_cookie and forwards it to our backend

//TODO :add network error specific message

export const route = {
  preload({ params }) {
    void getRecipe(params.id!);
  }
};

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
            <>
              <RecipeProvider initialRecipe={data()}>
                <RecipeEditorContent />
              </RecipeProvider>
            </>
          )}
        </Show>

      </Suspense>
    </ErrorBoundary>
  );
}
