import { clientOnly } from "@solidjs/start";
import RecipeSearch from "~/components/home/RecipeSearch";

/**
 * Landing page - title, a cross-user recipe search/browse list (RecipeSearch), and
 * the home dock (my-recipes-search/login/create-recipe). RecipeSearch is unrelated
 * to the dock's own SearchModule: that one searches only the signed-in user's own
 * recipes from a popout panel, this one browses/searches every user's recipes,
 * ordered by popularity, directly on the page.
 */
export default function Home() {
  const HomeDock = clientOnly(() => import("~/components/home/HomeDock"));

  return (
    <div class="w-full overflow-hidden">
      <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
        <section class="mt-20 mb-40">
          <h1 class="text-fluid-2xl-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
            Rosemary & Thyme
          </h1>
          <p class="mt-4 mb-6 text-fluid-sm-lg text-foreground3">
            Your recipes, all in one place.
          </p>
          <RecipeSearch />
        </section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
          <HomeDock />
        </section>
      </main>
    </div>
  );
}
