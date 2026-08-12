
import { UUID } from "./UUID"

/** Mirrors the backend's IngredientDTO. */
export type Ingredient = {
  id: UUID
  name: string,
  amount: number,
  measuringUnit: string,
}

/** Mirrors the backend's InstructionDTO. `images` is a list of ids into `Recipe.images`, in display order. */
export type Instruction = {
  id: UUID,
  text: string,
  images: UUID[]
}

