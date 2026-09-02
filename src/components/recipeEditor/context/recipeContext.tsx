import { createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeImage } from "~/model/types/utils";
import { UUID } from "~/model/types/UUID";

/**
 * Defines the RecipeContextType type.
 */
type RecipeContextType = {
  recipe: Recipe,
  changedFlag: () => boolean,
  /**
 * Reasons `saveRecipe` would currently refuse to save (limit violations) - see utils/validateRecipe.ts.
 */
  saveBlockers: () => string[],
  editName: (text: string) => void
  editDescription: (text: string) => void
  editRating: (rating: number) => void
  editPortion: (portion: number) => void
  editCookTime: (text: string) => void
  editDifficulty: (difficulty: number) => void
  editSideNotes: (text: string) => void
  addIngredient: () => void
  editIngredient: (ingredient: Ingredient) => void
  removeIngredient: (id: UUID) => void
  addInstruction: (id: UUID) => void
  editInstruction: (instruction: Instruction) => void
  addInstructionImage: (image: RecipeImage, instructionId: UUID) => void,
  removeInstruction: (id: UUID) => void
  addBannerImage: (image: RecipeImage) => void
  removeBannerImage: (index: number) => void,
  /**
 * Deletes an image everywhere it's referenced - see RecipeProvider.
 */
  removeImage: (id: UUID) => void,
  saveRecipe: (recipe: Recipe) => void

}
export const RecipeContext = createContext<RecipeContextType>();
