import { UUID } from "../types/UUID"
import { RecipeImage } from "../types/utils"

export type ImageGalleryProps = {
  images: UUID[],
  sectionName: string
  addImage: (image: RecipeImage, ...args: unknown[]) => void
}
