import { createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import NotificationProvider from "./components/notification/context/NotificationProvider";
import { ErrorBoundary, Suspense } from "solid-js";
import { getUser } from "./queries/getUser";
import Loading from "./components/Loading";
import ServerError from "./components/error/ServerError";

/**
 * App root: wraps every route in the providers pages need regardless of
 * which one they are (auth, toasts) and resolves the current user exactly
 * once per page load. `getUser()` runs inside the `<Router>`'s `root`, so it
 * (and the [Suspense] boundary around it) applies to every route uniformly,
 * rather than each page having to resolve auth itself.
 *
 * The `<ErrorBoundary>` around `props.children` is the app-wide catch-all for an
 * uncaught render/fetch error on any page - shows the themed ServerError page instead
 * of a blank/crashed app. It sits inside AuthProvider/NotificationProvider (not
 * around them) so a page-level error still leaves those providers - and so the dock,
 * nav, etc. built on top of them - intact; a more specific ErrorBoundary further down
 * a page's own tree (e.g. routes/recipe/[id].tsx, for a failed recipe fetch) still
 * takes priority over this one.
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
                <ErrorBoundary fallback={() => <ServerError />}>
                  {props.children}
                </ErrorBoundary>
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
