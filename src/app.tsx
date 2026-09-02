import { createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import NotificationProvider from "./components/notification/context/NotificationProvider";
import { ErrorBoundary, Suspense } from "solid-js";
import { getUser } from "./queries/getUser";
import Loading from "./components/Loading";
import ServerError from "./components/error/ServerError";
import CookieNotice from "./components/common/CookieNotice";
import AccountDeletionNotice from "./components/common/AccountDeletionNotice";

/**
 * Provides the App function.
 */
export default function App() {
  return (
    <Router
      root={(props) => {
        const user = createAsync(() => getUser());

        return (
          <>
            <Suspense fallback={<Loading />}>
              <NotificationProvider>
                <AuthProvider user={user() ?? null}>
                  <ErrorBoundary fallback={() => <ServerError />}>
                    {props.children}
                  </ErrorBoundary>
                  {/*
                    Sibling to the ErrorBoundary above, not inside it - an unrelated
                    page error shouldn't hide this, and it doesn't render anything of
                    its own to break. Needs both AuthProvider (useAuth()) and
                    NotificationProvider (useNotification()), unlike CookieNotice below,
                    which is why it lives here instead of alongside that one.
                  */}
                  <AccountDeletionNotice />
                </AuthProvider>
              </NotificationProvider>
            </Suspense>
            {/*
              Outside the Suspense above deliberately - it doesn't depend on
              getUser() at all, so it shouldn't wait behind that boundary's
              loading fallback (or disappear behind ServerError's fallback on
              an unrelated page error).
            */}
            <CookieNotice />
          </>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
