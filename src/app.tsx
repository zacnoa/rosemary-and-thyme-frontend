import { createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import NotificationProvider from "./components/notification/context/NotificationProvider";
import { Suspense } from "solid-js";
import { getUser } from "./queries/getUser";
import Loading from "./components/Loading";

/**
 * App root: wraps every route in the providers pages need regardless of
 * which one they are (auth, toasts) and resolves the current user exactly
 * once per page load. `getUser()` runs inside the `<Router>`'s `root`, so it
 * (and the [Suspense] boundary around it) applies to every route uniformly,
 * rather than each page having to resolve auth itself.
 */
export default function App() {
  return (
    <Router
      root={(props) => {
        const user = createAsync(() => getUser());

        return (
          <Suspense fallback={<Loading />}>
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
