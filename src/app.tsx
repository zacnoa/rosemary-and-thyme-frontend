import { createAsync, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import AuthProvider from "./components/auth/context/AuthProvider";
import NotificationProvider from "./components/notification/context/NotificationProvider";
import { Suspense } from "solid-js";
import { getUser } from "./queries/getUser";

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
