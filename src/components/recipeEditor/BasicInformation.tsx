import { For, Index } from "solid-js";
import { useRecipe } from "./context/useRecipe";
import Ingredient from "./Ingredient";

/** Ingredients list + cook time/portions/difficulty. Difficulty is a 1-5 star picker - see RecipesRecord's DB check constraint on the backend for why it's bounded to that range. */
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
      <div class="flex">
        <ul class="w-1/2 flex flex-col gap-4 list-none border-r-3 md:border-r-4 border-orange pt-3 pr-3">
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
        <aside class="w-1/2 pt-3 pl-3 flex flex-col gap-4">
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
