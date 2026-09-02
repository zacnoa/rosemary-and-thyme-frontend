import { Recipe } from "../interfaces/Recipe"
import { UUID } from "./UUID"

/**
 * Defines the RecipeImage type.
 */
export type RecipeImage = {
  id: UUID
  url: string | null,
  blob: File | null
  blobURL: string | null
}

/**
 * Defines the RecipeImageDTO type.
 */
export type RecipeImageDTO = {
  id: UUID
  url: string | null
}

/**
 * Defines the RecipeDTO type.
 */
export type RecipeDTO = Omit<Recipe, "images"> & {
  images: Record<UUID, RecipeImageDTO>
}

/**
 * Defines the RecipeWriteDTO type.
 */
export type RecipeWriteDTO = Pick<RecipeDTO,
  "name" | "description" | "portions" | "cookTime" | "difficulty" | "sideNotes" |
  "images" | "ingredients" | "instructions" | "ingredientsOrder" | "instructionsOrder" | "heroImagesOrder"
>

/**
 * Provides the stripBlobData function.
 */
export const stripBlobData = (recipe: Recipe): RecipeWriteDTO => {

  const strippedImages = Object.fromEntries(
    Object.entries(recipe.images).map(([id, img]) => [
      id,
      {
        id: img.id,
        url: img.url, // url only - blob/blobURL are meaningless to the backend
      }
    ])
  );

  return {
    ...recipe,
    images: strippedImages,
  };
};
