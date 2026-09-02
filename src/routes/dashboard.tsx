import { onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { useAuth } from "~/components/auth/context/useAuth";
import RecipeSearch from "~/components/dashboard/RecipeSearch";
import LikedRecipes from "~/components/dashboard/LikedRecipes";
import AccountSettings from "~/components/dashboard/AccountSettings";
import { loginHref } from "~/utils/loginRedirect";

/**
 * Provides the Dashboard function.
 */
export default function Dashboard() {
  const user = useAuth();
  const navigate = useNavigate();
  const HomeDock = clientOnly(() => import("~/components/home/HomeDock"));

  onMount(() => {
    if (!user) navigate(loginHref("/dashboard"), { replace: true });
  });

  return (
    <Show when={user}>
      {(u) => (
        <div class="w-full overflow-hidden">
          <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
            <section class="mt-20 mb-40">
              <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
                {u().username}
              </h1>
              <p class="mt-4 mb-6 text-sm md:text-lg text-foreground3">
                {u().email}
              </p>
              <div class="flex flex-col gap-10">
                <RecipeSearch />
                <LikedRecipes />
              </div>
              <AccountSettings user={u()} />
            </section>
            <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
              <HomeDock />
            </section>
          </main>
        </div>
      )}
    </Show>
  );
}
