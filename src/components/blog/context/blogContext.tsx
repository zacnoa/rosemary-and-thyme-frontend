import { Accessor, createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"

/** Defines the blogContext type. */
type blogContext = {
  recipe: Recipe
  liked: Accessor<boolean>
  likes: Accessor<number>
  timesMade: Accessor<number>
  madePending: Accessor<boolean>
  /** Toggles the current user's like on this recipe - redirects to login instead if signed out (see BlogProvider.toggleLike). */
  toggleLike: () => void
  markMade: () => void
}

export const BlogContext = createContext<blogContext>();

