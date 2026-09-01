import { onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { useAuth } from "~/components/auth/context/useAuth";
import RecipeSearch from "~/components/dashboard/RecipeSearch";
import LikedRecipes from "~/components/dashboard/LikedRecipes";
import AccountSettings from "~/components/dashboard/AccountSettings";
import { loginHref } from "~/utils/loginRedirect";

/**
 * Login-gated dashboard: the signed-in user's own recipes (browsable/searchable,
 * togglable private/public, and deletable - see components/dashboard/RecipeSearch.tsx /
 * DashboardRecipeCard.tsx) and, below that, the recipes they've liked (see
 * components/dashboard/LikedRecipes.tsx / LikedRecipeCard.tsx) - two independently
 * scrollable sections, since they're different collections with different actions
 * available on each. Same title layout as routes/index.tsx (h1 + border + paragraph
 * underneath), just showing the caller's own username/email instead of the app's
 * tagline, and reusing HomeDock as-is - every module on it (search/theme/user/
 * create-recipe) works equally well here, so there's no need for a dedicated
 * dashboard dock.
 *
 * `useAuth()` is already resolved (server-side, via app.tsx's root) by the time this
 * component renders, so a signed-out visitor is caught immediately: `<Show>` never
 * renders the recipe list for them, and `onMount` sends them to `/auth/login` right
 * away - same client-side redirect pattern as BlogProvider.toggleLike (a plain
 * `navigate()` call, not a thrown server redirect, since `useAuth()`'s snapshot is a
 * page-level value with no request of its own to redirect from).
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
              <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
                {u().username}
              </h1>
              <p class="mt-4 mb-6 text-fluid-sm-lg text-foreground3">
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
