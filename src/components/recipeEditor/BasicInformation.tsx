import { For, Index } from "solid-js";
import { useRecipe } from "./context/useRecipe";
import Ingredient from "./Ingredient";

/**
 * Ingredients list + cook time/portions/difficulty ("aside").
 *
 * Side-by-side 50/50 columns on desktop (unchanged), but stacked full-width
 * on mobile - aside *above* the ingredients list, not below, since it's the
 * shorter of the two and reads more like a summary. `order-*` utilities
 * drive that: both elements stay in their original DOM order (ingredients
 * `<ul>` then `<aside>`, so nothing else that reads this markup needs to
 * change), only their *visual* order is flipped on mobile via `order-1`/
 * `order-2`, then reset back to the desktop order with `md:order-1`/
 * `md:order-2`.
 *
 * The dividing orange line follows the same flip: on desktop it's a
 * vertical line (`md:border-r-4` on the ingredients column, sitting between
 * the two side-by-side columns); on mobile there's no vertical line at all
 * (nothing to divide left/right when stacked) - instead `aside` gets a
 * `border-b-3`, since it's visually on top, so the line still sits exactly
 * on the boundary between the two sections either way.
 *
 * Difficulty is a 1-5 star picker - see RecipesRecord's DB check constraint
 * on the backend for why it's bounded to that range.
 */
export default function BasicInformation() {
  const context = useRecipe();
  return (
    <section>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <h2 class="text-fluid-lg-4xl font-bold pb-1 w-1/2 border-r-3 md:border-r-4 border-orange">
          What You Need
        </h2>
        <span class="flex-1" />
      </div>
      <div class="flex flex-col md:flex-row">
        <ul class="w-full md:w-1/2 order-2 md:order-1 flex flex-col gap-4 list-none border-orange md:border-r-4 pt-3 pr-0 md:pr-3">
          <For each={context.recipe.ingredientsOrder}>
            {(id) => (
              <li class="text-fluid-sm-xl">
                <Ingredient id={id} />
              </li>
            )}
          </For>
          <li>
            <button
              class="mt-2 px-3 py-1 text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
              onClick={context.addIngredient}
            >
              + Add Ingredient
            </button>
          </li>
        </ul>
        <aside class="w-full md:w-1/2 order-1 md:order-2 border-orange border-b-3 md:border-b-0 pt-3 pb-4 md:pb-0 pl-0 md:pl-3 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-fluid-sm-xl">Preparation</span>
            <span class="text-orange">→</span>
            <input
              class="outline-none text-fluid-base-xl flex-1"
              value={context.recipe.cookTime}
              placeholder="30 min"
              onInput={(e) => context.editCookTime(e.currentTarget.value)}
              spellcheck="false"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-fluid-sm-xl">Portions</span>
            <span class="text-orange">→</span>
            <input
              class="outline-none text-fluid-sm-xl w-12"
              value={context.recipe.portions}
              type="text"
              onInput={(e) => context.editPortion(Number(e.currentTarget.value))}
            />
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-fluid-sm-xl">Difficulty</span>
            <div class="flex gap-1">
              <Index each={[1, 2, 3, 4, 5]}>
                {(star) => (
                  <span
                    class="cursor-pointer text-fluid-xl-2xl"
                    style={{
                      color: star() <= context.recipe.difficulty
                        ? "var(--color-blue)"
                        : "var(--color-foreground)"
                    }}
                    onClick={() => context.editDifficulty(star())}
                  >
                    ★
                  </span>
                )}
              </Index>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
