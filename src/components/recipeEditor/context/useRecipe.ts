import { useContext } from "solid-js"
import { RecipeContext } from "./recipeContext"

export const useRecipe = () => {

  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error("useRecipe mora biti unutar RecipeProvider")
  return ctx
}
