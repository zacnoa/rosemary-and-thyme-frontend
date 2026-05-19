import { Recipe } from "../interfaces/Recipe"
import { UUID } from "./UUID"

export type RecipeImage = {
  id: UUID
  url: string | null,
  blob: File | null
  blobURL: string | null
}

export type RecipeImageDTO = {
  id: UUID
  url: string | null
}

export type RecipeDTO = Omit<Recipe, "images"> & {
  images: Record<UUID, RecipeImageDTO>
}

export const stripBlobData = (recipe: Recipe): RecipeDTO => {

  console.log(recipe)
  const strippedImages = Object.fromEntries(
    Object.entries(recipe.images).map(([id, img]) => [
      id,
      {
        id: img.id,
        url: img.url, // samo url, bez blob i blobURL
      }
    ])
  );

  return {
    ...recipe,
    images: strippedImages,
  };
};
