import { createSignal } from "solid-js";
import { useRecipe } from "./context/useRecipe";

export default function Ingredient({ id }: { id: string }) {
  const context = useRecipe();
  const ingredient = () => context.recipe.ingredients[id];

  const format = () =>
    [ingredient().name, ingredient().amount || "", ingredient().measuringUnit]
      .filter(Boolean)
      .join(" ");

  // The input's displayed text is kept in local state rather than derived
  // straight from the store: commit() below reformats "name amount unit"
  // (e.g. inserts the space between amount and unit) every time it parses
  // successfully, and if that reformatted string fed straight back into a
  // store-derived `value`, it would fight the user mid-keystroke (cursor
  // jumping) on every commit instead of only once, on blur, as before.
  const [text, setText] = createSignal(format());

  // Parses "name amount unit" and, on a match, commits it to the store.
  // Runs on every keystroke (not just blur) so anything reading the store
  // live - e.g. the ingredients dock panel - reflects what's being typed,
  // not just the last value entered before the field lost focus.
  const commit = (value: string) => {
    const match = value.match(/^(.+?)\s+([\d.]+)\s*(\p{L}+)?$/u)
    if (match) {
      context.editIngredient({
        ...ingredient(),
        name: match[1].trim(),
        amount: Number(match[2]),
        measuringUnit: match[3] ?? "",
      })
    }
  }

  return (
    <div class="flex items-center gap-2">
      <input
        type="text"
        class="bg-transparent outline-none w-full"
        value={text()}
        placeholder="npr. Pileca prsa 150g"
        onInput={(e) => {
          setText(e.currentTarget.value);
          commit(e.currentTarget.value);
        }}
        onBlur={(e) => {
          commit(e.currentTarget.value);
          // normalize the visible text (e.g. "150g" -> "150 g") now that
          // the field is no longer being actively typed into
          setText(format());
        }}
        spellcheck="false"
      />
      <button
        class="cursor-pointer text-foreground"
        onClick={() => context.removeIngredient(id)}
      >
        ✕
      </button>
    </div>
  )
}
