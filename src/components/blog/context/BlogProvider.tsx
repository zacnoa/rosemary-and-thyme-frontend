import { Recipe } from "~/model/interfaces/Recipe";
import { BlogContext } from "./blogContext";
import { createStore } from "solid-js/store";
import { createSignal, ParentProps, Show } from "solid-js";
import { UUID } from "~/model/types/UUID";
import ImageViewer from "~/components/recipeEditor/ImageViewer";

interface BlogProviderProps extends ParentProps {
  recipe: Recipe
}

/**
 * Read-only view of a recipe for visitors who aren't its owner (see
 * routes/recipe/[id].tsx, which picks this vs. RecipeProvider based on that).
 * Still wraps `props.recipe` in a store (like RecipeProvider does) purely
 * for consistent, fine-grained reactive reads by shared components like
 * IngredientsModule - nothing here ever calls `setRecipe`, so in practice
 * this store's value never changes after mount.
 *
 * Also mounts the shared ImageViewer, same as RecipeProvider - but with no
 * `onDelete`, since this context exposes no mutators at all (see
 * ImageViewer for how that hides the delete button).
 */
export default function BlogProvider(props: BlogProviderProps) {

  const [recipe, setRecipe] = createStore<Recipe>(props.recipe)
  const [viewerImages, setViewerImages] = createSignal<{ images: UUID[], initialIndex?: number } | null>(null);

  const openViewer = (images: UUID[], initialIndex: number = 0) => setViewerImages({ images: images, initialIndex: initialIndex });
  const closeViewer = () => setViewerImages(null);

  return (
    <BlogContext.Provider value={{
      recipe,
      viewerImages,
      openViewer,
      closeViewer,
    }}>
      {props.children}
      <Show when={viewerImages()?.images}>
        <ImageViewer
          images={viewerImages()!.images}
          imageMap={recipe.images}
          initialIndex={viewerImages()?.initialIndex}
          onClose={closeViewer}
        />
      </Show>
    </BlogContext.Provider>


  )
}
