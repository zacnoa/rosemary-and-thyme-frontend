import { createContext } from "solid-js";
import { Recipe } from "~/model/interfaces/Recipe";
import { Ingredient, Instruction } from "~/model/types/recipeTypes";
import { RecipeImage } from "~/model/types/utils";
import { UUID } from "~/model/types/UUID";

/** The editable recipe store plus every mutator on it - see RecipeProvider, the only implementation. */
type RecipeContextType = {
  recipe: Recipe,
  changedFlag: () => boolean,
  /** Reasons `saveRecipe` would currently refuse to save (limit violations) - see utils/validateRecipe.ts. Empty when the recipe is within every limit. */
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
  viewerImages: () => { images: UUID[], initialIndex?: number } | null
  openViewer: (images: UUID[], initialIndex?: number) => void
  closeViewer: () => void
  removeImage: (id: UUID) => void,
  saveRecipe: (recipe: Recipe) => void

}
export const RecipeContext = createContext<RecipeContextType>();
