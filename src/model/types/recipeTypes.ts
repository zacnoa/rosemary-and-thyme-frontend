
import { UUID } from "./UUID"

/**
 * Defines the Ingredient type.
 */
export type Ingredient = {
  id: UUID
  name: string,
  amount: number,
  measuringUnit: string,
}

/**
 * Defines the Instruction type.
 */
export type Instruction = {
  id: UUID,
  text: string,
  images: UUID[]
}

