import { Ingredient, Instruction } from "../types/recipeTypes";
import { RecipeImage } from "../types/utils";
import { UUID } from "../types/UUID";

/**
 * The frontend's full recipe shape - mirrors the backend's RecipeDTO,
 * except `images` here is `RecipeImage` (adds `blob`/`blobURL` for
 * in-progress local edits) rather than the wire `RecipeImageDTO`
 * (`{id, url}`) - see model/types/utils.ts for that split and
 * `stripBlobData()`, which converts back to the wire shape before a save.
 *
 * Held in a Solid store by RecipeProvider (editable) or BlogProvider
 * (read-only) - see those for how mutations flow through this shape.
 *
 * `createDate` is typed as a real `Date`, but arrives over the wire as an
 * ISO string (`JSON.parse` doesn't revive dates) - every place a `Recipe`
 * is constructed from a server response converts it explicitly
 * (`new Date(...)`) before the value is treated as a `Recipe` at all: see
 * queries/getRecipe.ts and RecipeProvider.applyServerRecipe.
 */
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
