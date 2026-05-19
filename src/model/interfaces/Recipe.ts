import { Ingredient, Instruction } from "../types/recipeTypes";
import { RecipeImage } from "../types/utils";
import { UUID } from "../types/UUID";

export interface Recipe {

  id: UUID,
  userId: UUID,
  userName: string,
  createDate: Date,
  name: string,
  description: string,
  likes: number,
  portions: number,
  cookTime: string,
  difficulty: number,
  sideNotes: string,
  images: Record<UUID, RecipeImage>

  ingredients: Record<UUID, Ingredient>,
  instructions: Record<UUID, Instruction>,
  ingredientsOrder: UUID[],
  instructionsOrder: UUID[],
  heroImagesOrder: UUID[],


}
