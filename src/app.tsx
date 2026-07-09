import { createAsync, query, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";



//TODO: Check validity of using include credentials
const fetchUser = query(async (): Promise<string> => {
  const result = await fetch("http://localhost:8080/auth/aboutme",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })

  if (!result.ok) {
    throw Error("User is not logged in")
  }

  const user = await result.json()

  return user
}, "user")

export default function App() {



  return (

    <Router
      root={props => {
        const user = createAsync(() => fetchUser())
        return (
          <>
            <AuthProvider user={user.latest ?? ""} >
              <Suspense>{props.children}</Suspense>
            </AuthProvider>
          </>
        )
      }}
    >
      <FileRoutes />
    </Router>
  );
}
