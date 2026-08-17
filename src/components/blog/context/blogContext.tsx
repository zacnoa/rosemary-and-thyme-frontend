import { Accessor, createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"
import { UUID } from "~/model/types/UUID";

/**
 * Read-only counterpart of RecipeContext - the recipe plus the lightbox viewer
 * state, but no mutators for the recipe's own content (see BlogProvider). `like` is
 * the one exception: it's the single interactive action a visitor can take on an
 * otherwise-read-only recipe, so it lives here rather than on `recipe` itself
 * (`recipe.liked`/`recipe.likes` are just the server-sent initial values - see
 * BlogProvider for why the live state is tracked separately in `liked`/`likes`).
 */
type blogContext = {
  recipe: Recipe
  liked: Accessor<boolean>
  likes: Accessor<number>
  /** Toggles the current user's like on this recipe - redirects to login instead if signed out (see BlogProvider.toggleLike). */
  toggleLike: () => void
  viewerImages: Accessor<{ images: UUID[], initialIndex?: number } | null>
  openViewer: (images: UUID[], initialIndex?: number) => void
  closeViewer: () => void
}

export const BlogContext = createContext<blogContext>();


