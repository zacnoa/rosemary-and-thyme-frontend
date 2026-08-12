
import { useContext } from "solid-js"
import { AuthContext } from "./authContext"

/**
 * @returns the current user, or `null` if logged out. A plain snapshot, not
 * reactive to login/logout happening elsewhere on the same page - see
 * AuthProvider for why.
 * @throws if called outside an AuthProvider (i.e. the context was never set,
 * as opposed to being set to `null` for a logged-out user)
 */
export const useAuth = () => {

  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error("useAuth mora biti unutar AuthProvider")
  return ctx
}
