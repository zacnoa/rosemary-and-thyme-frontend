import { ParentProps } from "solid-js";
import { AuthContext, User } from "./authContext";

type AuthProviderProps = ParentProps & {
  user: User | null
}

/**
 * Publishes the current user, resolved once per page load in app.tsx via
 * `createAsync(() => getUser())` (a server round-trip, since the
 * `session_cookie` is `httpOnly` and can only be checked server-side - see
 * utils/cookiesMiddleware.ts and queries/getUser.ts).
 *
 * Deliberately not a signal: `props.user` is provided as a plain value, so
 * `useAuth()` returns a point-in-time snapshot rather than something that
 * updates live client-side. That's intentional - both login (login.tsx) and
 * logout (UserModule.tsx) do a full `window.location.href` navigation
 * instead of a soft client-side route change specifically so the next page
 * load re-resolves `getUser()` from scratch, rather than needing this
 * context to be reactive.
 */
export default function AuthProvider(props: AuthProviderProps) {


  return (
    <AuthContext.Provider value={props.user}>
      {props.children}
    </AuthContext.Provider>


  )
}
