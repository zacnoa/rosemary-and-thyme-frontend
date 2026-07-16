import { createAsync, Router, query } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { isServer, getRequestEvent } from "solid-js/web";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import { User } from "./components/auth/context/authContext";

const fetchUser = query(async (): Promise<User | null> => {
  console.log("fetchUser START");

  const cookie = isServer
    ? (getRequestEvent()?.request.headers.get("cookie") ?? "")
    : undefined;

  console.log("cookie:", cookie);

  const result = await fetch("http://localhost:8080/auth/aboutme", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {})
    },
    credentials: "include"
  });

  console.log("status:", result.status);
  console.log("content-type:", result.headers.get("content-type"));

  const text = await result.text();

  console.log("response body:", text);

  if (!result.ok) {
    console.log("AUTH ERROR", result.status);

    const text = await result.text();
    console.log("AUTH BODY", text);

    return null;
  }

  const user = JSON.parse(text);

  return {
    username: user.username,
    id: user.id
  };
}, "user");

export default function App() {
  return (
    <Router
      root={props => {
        const user = createAsync(() => fetchUser());
        return (
          <Suspense>
            <AuthProvider user={user.latest ?? null}>
              {props.children}
            </AuthProvider>
          </Suspense>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
