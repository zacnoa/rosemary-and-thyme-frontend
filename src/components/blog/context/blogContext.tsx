import { Accessor, createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"
import { UUID } from "~/model/types/UUID";

/** Read-only counterpart of RecipeContext - the recipe plus the lightbox viewer state, but no mutators (see BlogProvider). */
type blogContext = {
  recipe: Recipe
  viewerImages: Accessor<{ images: UUID[], initialIndex?: number } | null>
  openViewer: (images: UUID[], initialIndex?: number) => void
  closeViewer: () => void
}

export const BlogContext = createContext<blogContext>();


