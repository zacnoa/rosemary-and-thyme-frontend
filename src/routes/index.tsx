import { clientOnly } from "@solidjs/start";
import { useSearchParams } from "@solidjs/router";
import RecipeSearch from "~/components/home/RecipeSearch";

/**
 * Provides the Home function.
 */
export default function Home() {
  const HomeDock = clientOnly(() => import("~/components/home/HomeDock"));
  const [searchParams] = useSearchParams();
  const initialQuery = () =>
    Array.isArray(searchParams.query) ? searchParams.query[0] : searchParams.query;

  return (
    <div class="w-full overflow-hidden">
      <main class="md:max-w-4xl my-4 mx-2 md:mx-auto">
        <section class="mt-20 mb-40">
          <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
            Rosemary & Thyme
          </h1>
          <p class="mt-4 mb-6 text-sm md:text-lg text-foreground3">
            Your recipes, all in one place.
          </p>
          <RecipeSearch initialQuery={initialQuery()} />
        </section>
        <section class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92vw] max-w-md md:w-auto md:max-w-none">
          <HomeDock />
        </section>
      </main>
    </div>
  );
}
