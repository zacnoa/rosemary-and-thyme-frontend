
import { createContext } from "solid-js";
import { UUID } from "~/model/types/UUID";

export type User = {
  username: string,
  id: UUID
}


export const AuthContext = createContext<User | null>();

