import { clientOnly } from "@solidjs/start";

/**
 * Landing page - just a title and the home dock (search/login/create-recipe);
 * there's no recipe feed or listing here, search (SearchModule) is the only
 * way to reach an existing recipe from this page.
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
          <p class="mt-4 text-fluid-sm-lg text-foreground3">
            Your recipes, all in one place.
          </p>
        </section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
          <HomeDock />
        </section>
      </main>
    </div>
  );
}
