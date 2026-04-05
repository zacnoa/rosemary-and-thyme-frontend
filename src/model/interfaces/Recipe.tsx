import { Ingredient, Instruction } from "../types/recipeTypes";
import { RecipeImage } from "../types/utils";
import { UUID } from "../types/UUID";

export interface Recipe {

  userId: UUID
  name: string,
  description: string,
  images: RecipeImage[],
  rating: number,
  portions: number,
  cookTime: string,
  difficulty: number,
  sideNotes: string,

  ingredients: Record<UUID, Ingredient>,
  instructions: Record<UUID, Instruction>,
  ingredientsOrder: UUID[],
  instructionsOrder: UUID[],

}
