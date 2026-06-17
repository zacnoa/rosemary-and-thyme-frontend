import { createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe"

type blogContext = {
  recipe: Recipe
}

export const BlogContext = createContext<blogContext>();



