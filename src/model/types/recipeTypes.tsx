import { UUID } from "./UUID"

export type Ingredient = {
  id: UUID
  name: string,
  amount: number,
  measuringUnit: string,
  index: number,
}

export type Instruction = {
  id: UUID,
  name: string,
  text: string,
  index: number,
  images: Blob[]
}


