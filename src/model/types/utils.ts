import { UUID } from "./UUID"

export type RecipeImage = {
  id: UUID
  url: string | null,
  blob: File | null
  blobURL: string | null
}
