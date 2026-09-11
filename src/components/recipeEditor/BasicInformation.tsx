import { For, Index, Show, createSignal } from "solid-js";
import { Eye, EyeOff } from "lucide-solid";
import { useRecipe } from "./context/useRecipe";
import Ingredient from "./Ingredient";
import { useWakeLock } from "~/components/common/useWakeLock";

/** Provides the BasicInformation function. */
export default function BasicInformation() {
  const context = useRecipe();
  const wakeLock = useWakeLock();

  // Local buffer for the Portions input, same reasoning as Ingredient.tsx's
  // amount field: `Number(e.currentTarget.value)` on a non-numeric string
  // (e.g. "abc") is NaN, and committing that straight to the store used to
  // both store NaN *and* echo it right back into the input as the literal
  // text "NaN". Buffering locally means an unparsable keystroke is simply
  // never committed - the store (and so the displayed value once it's
  // reverted on blur) only ever holds a real number.
  const [portionsText, setPortionsText] = createSignal(String(context.recipe.portions));

  const commitPortions = (raw: string) => {
    setPortionsText(raw);
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      context.editPortion(parsed);
    }
  };

  /** Provides the revertPortionsIfInvalid function. */
  const revertPortionsIfInvalid = () => {
    if (!Number.isFinite(Number(portionsText()))) {
      setPortionsText(String(context.recipe.portions));
    }
  };

  return (
    <section>
      <div class="flex border-b-3 md:border-b-4 border-foreground2">
        <h2 class="text-lg md:text-4xl font-bold pb-1 w-1/2 border-r-3 md:border-r-4 border-orange">
          What You Need
        </h2>
        <button
          type="button"
          onClick={wakeLock.toggle}
          disabled={!wakeLock.supported()}
          title={wakeLock.supported() ? undefined : "Keeping the screen on isn't supported in this browser"}
          class={`flex-1 flex items-center pl-2 md:pl-4 gap-1 md:gap-2 pb-1 text-xs md:text-sm ${wakeLock.supported() ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            } ${wakeLock.active() ? "text-green" : "text-foreground3"}`}
        >
          <Show when={wakeLock.active()} fallback={<EyeOff class="size-3 md:size-4 shrink-0" />}>
            <Eye class="size-3 md:size-4 shrink-0" />
          </Show>
          Press to keep screen awake
        </button>
      </div>
      <div class="flex flex-col md:flex-row">
        <ul class="w-full md:w-1/2 order-2 md:order-1 flex flex-col gap-4 list-none border-orange md:border-r-4 pt-3 pr-0 md:pr-3">
          <For each={context.recipe.ingredientsOrder}>
            {(id) => (
              <li class="text-sm md:text-xl">
                <Ingredient id={id} />
              </li>
            )}
          </For>
          <li>
            <button
              class="mt-2 px-3 py-1 text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
              onClick={context.addIngredient}
            >
              + Add Ingredient
            </button>
          </li>
        </ul>
        <aside class="w-full md:w-1/2 order-1 md:order-2 border-orange border-b-3 md:border-b-0 pt-3 pb-4 md:pb-0 pl-0 md:pl-3 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm md:text-xl">Preparation</span>
            <span class="text-orange">→</span>
            <input
              class="outline-none text-base md:text-xl flex-1"
              value={context.recipe.cookTime}
              placeholder="30 min"
              onInput={(e) => context.editCookTime(e.currentTarget.value)}
              spellcheck="false"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm md:text-xl">Portions</span>
            <span class="text-orange">→</span>
            <input
              class="outline-none text-sm md:text-xl w-12"
              value={portionsText()}
              type="text"
              inputmode="numeric"
              onInput={(e) => commitPortions(e.currentTarget.value)}
              onBlur={revertPortionsIfInvalid}
            />
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm md:text-xl">Difficulty</span>
            <div class="flex gap-1">
              <Index each={[1, 2, 3, 4, 5]}>
                {(star) => (
                  <span
                    class="cursor-pointer text-xl md:text-2xl"
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
