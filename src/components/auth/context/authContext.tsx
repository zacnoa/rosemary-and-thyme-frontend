
import { createContext } from "solid-js";
import { UUID } from "~/model/types/UUID";

/** Public profile of the currently authenticated user (mirrors the backend's UserDTO). */
export type User = {
  username: string,
  id: UUID,
  email: string
}

/**
 * Holds the current user (or `null` if logged out) for the whole app.
 * Populated once, server-side, by AuthProvider from queries/getUser.ts - see
 * that provider for why this is a plain value rather than a signal.
 */
export const AuthContext = createContext<User | null>();
