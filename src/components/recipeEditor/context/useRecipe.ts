import { useContext } from "solid-js"
import { RecipeContext } from "./recipeContext"

/**
 * @returns the enclosing RecipeProvider's store + mutators - see that
 * provider for the store/reactivity model.
 * @throws if called outside a RecipeProvider
 */
export const useRecipe = () => {

  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error("useRecipe mora biti unutar RecipeProvider")
  return ctx
}
