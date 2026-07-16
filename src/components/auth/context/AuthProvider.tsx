import { ParentProps } from "solid-js";
import { AuthContext, User } from "./authContext";

type AuthProviderProps = ParentProps & {
  user: User | null
}

export default function AuthProvider(props: AuthProviderProps) {


  return (
    <AuthContext.Provider value={props.user}>
      {props.children}
    </AuthContext.Provider>


  )
}
