import { Accessor, createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"

/**
 * Defines the blogContext type.
 */
type blogContext = {
  recipe: Recipe
  liked: Accessor<boolean>
  likes: Accessor<number>
  /**
 * Toggles the current user's like on this recipe - redirects to login instead if signed out (see BlogProvider.toggleLike).
 */
  toggleLike: () => void
}

export const BlogContext = createContext<blogContext>();


