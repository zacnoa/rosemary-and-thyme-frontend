import { UUID } from "../types/UUID"

export type ImageViewerProps = {
  images: UUID[]
  onDelete: (id: string) => void
  onClose: () => void
}
