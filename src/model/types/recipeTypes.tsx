import { UUID } from "./UUID"

export type Ingredient = {
  id: UUID
  name: string,
  amount: number,
  measuringUnit: string,
}

export type Instruction = {
  id: UUID,
  text: string,
  images: UUID[]
}


