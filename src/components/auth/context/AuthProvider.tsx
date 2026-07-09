import { ParentProps } from "solid-js";
import { AuthContext } from "./authContext";

type AuthProviderProps = ParentProps & {
  user: string
}

export default function AuthProvider(props: AuthProviderProps) {


  return (
    <AuthContext.Provider value={props}>
      {props.children}
    </AuthContext.Provider>


  )
}
