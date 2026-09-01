import { Recipe } from "../interfaces/Recipe"
import { UUID } from "./UUID"

/**
 * A recipe image, at any point in its lifecycle from "just picked" to
 * "persisted on the server". Exactly one of `url`/`blobURL` is meaningful at
 * a time - which one, and why both fields exist instead of a single
 * discriminated union, follows from where each is produced:
 *
 * - **Freshly picked, not yet saved**: `url: null`, `blob` is the raw
 *   `File` the user selected, `blobURL` is a local `URL.createObjectURL(blob)`
 *   preview - see recipeEditor/ImageGallery.tsx's `handleChange`. Nothing
 *   here has touched the network yet.
 * - **Persisted (uploaded to Cloudinary, saved on the recipe)**: `url` is
 *   the real Cloudinary delivery URL, `blob`/`blobURL` are both `null` - set
 *   this way by RecipeProvider.applyServerRecipe once a save's response
 *   confirms the upload, and revokes the now-superseded `blobURL` (object
 *   URLs are a browser resource that leaks memory if never revoked).
 *
 * Anywhere an image is displayed (ImageGallery, DeleteImageModal), the render
 * logic is `url ?? blobURL!` - prefer the persisted url, fall back to the
 * local preview for anything not saved yet.
 */
export type RecipeImage = {
  id: UUID
  url: string | null,
  blob: File | null
  blobURL: string | null
}

/** The wire shape of a `RecipeImage` - just enough for the backend to know about (see the backend's own RecipeImageDTO). Never carries `blob`/`blobURL`, which only mean anything client-side. */
export type RecipeImageDTO = {
  id: UUID
  url: string | null
}

/** A `Recipe` with `images` narrowed to the wire shape - what actually gets sent to/received from `PUT /recipe/{id}` (see queries/putRecipe.ts, RecipeProvider.saveRecipe/applyServerRecipe). */
export type RecipeDTO = Omit<Recipe, "images"> & {
  images: Record<UUID, RecipeImageDTO>
}

/**
 * Strips `blob`/`blobURL` off every image before a recipe is serialized into
 * the `"recipe"` JSON part of a save's `FormData` (see
 * RecipeProvider.saveRecipe) - a raw `File` can't be JSON-serialized at all,
 * and neither field means anything to the backend; the actual file bytes go
 * over the wire separately, as their own multipart parts.
 *
 * @param recipe the recipe to convert (with local `RecipeImage`s)
 * @returns the same recipe with `images` narrowed to `{id, url}` pairs
 */
export const stripBlobData = (recipe: Recipe): RecipeDTO => {

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
