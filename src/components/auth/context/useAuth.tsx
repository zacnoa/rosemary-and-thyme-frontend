
import { useContext } from "solid-js"
import { AuthContext } from "./authContext"

/**
 * Provides the useAuth function.
 */
export const useAuth = () => {

  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error("useAuth mora biti unutar AuthProvider")
  return ctx
}
