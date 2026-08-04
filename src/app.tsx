import { createAsync, Router, query } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import NotificationProvider from "./components/notification/context/NotificationProvider";
import { getRequestEvent } from "solid-js/web";
import { User } from "./components/auth/context/authContext";
import { Suspense } from "solid-js";

const getUser = query(async () => {
  "use server";
  const event = getRequestEvent();
  const cookie = event?.locals.sessionCookie ?? "";

  const response = await fetch(`http://localhost:8080/user/aboutme`, {
    method: "GET",
    headers: { "Content-Type": "application/json", cookie: `session_cookie=${cookie}` },
  });

  if (response.status === 401 || response.status === 403) {
    // korisnik nije prijavljen — normalno stanje, ne greška
    return null;
  }

  if (!response.ok) {
    console.error("Auth check failed:", response.status);
    return null
  }

  const json = await response.json();
  return json as User;
}, "user");

export default function App() {
  return (
    <Router
      root={(props) => {
        const user = createAsync(() => getUser());

        return (
          <Suspense>
            <NotificationProvider>
              <AuthProvider user={user() ?? null}>
                {props.children}
              </AuthProvider>
            </NotificationProvider>
          </Suspense>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
