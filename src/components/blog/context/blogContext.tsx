import { Accessor, createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"

/**
 * Read-only counterpart of RecipeContext - just the recipe, no mutators for its
 * content and no image viewer/modal at all (see BlogProvider - a visitor can't
 * delete another user's image, and there's no lightbox any more either, see
 * components/blog/Blog.tsx's own ImageGallery). `like` is the one exception: it's
 * the single interactive action a visitor can take on an otherwise-read-only
 * recipe, so it lives here rather than on `recipe` itself (`recipe.liked`/
 * `recipe.likes` are just the server-sent initial values - see BlogProvider for
 * why the live state is tracked separately in `liked`/`likes`).
 */
type blogContext = {
  recipe: Recipe
  liked: Accessor<boolean>
  likes: Accessor<number>
  /** Toggles the current user's like on this recipe - redirects to login instead if signed out (see BlogProvider.toggleLike). */
  toggleLike: () => void
}

export const BlogContext = createContext<blogContext>();


