import { useRecipe } from "./context/useRecipe";

/**
 * One ingredient row: three plain inputs (name / amount / measuringUnit),
 * each bound directly to its own field on the store, committing on every
 * keystroke via [context.editIngredient] - no string parsing involved.
 *
 * This used to be a single combined "name amount unit" text field, parsed
 * with a regex on every keystroke (e.g. matching "Chicken breast 150g" into
 * its three parts). That approach had a real data-loss bug: whenever the
 * typed text didn't yet match the expected shape - most commonly, an
 * ingredient with no amount typed yet, like just "Salt" - `commit()` would
 * silently do nothing, and on blur the field would snap back to the last
 * value that *did* parse, discarding whatever the user had actually typed.
 * Since the underlying `Ingredient` model already stores name/amount/
 * measuringUnit as three separate fields (see model/types/recipeTypes.ts),
 * splitting the UI into three separate inputs removes the parsing step -
 * and the entire bug - rather than only working around it.
 */
export default function Ingredient({ id }: { id: string }) {
  const context = useRecipe();
  const ingredient = () => context.recipe.ingredients[id];

  return (
    <div class="flex items-center gap-2">
      <input
        type="text"
        class="bg-transparent outline-none min-w-0 flex-1"
        value={ingredient().name}
        placeholder="Naziv"
        onInput={(e) =>
          context.editIngredient({ ...ingredient(), name: e.currentTarget.value })
        }
        spellcheck="false"
      />
      <input
        type="number"
        class="bg-transparent outline-none w-14 shrink-0"
        // Blank instead of "0" for a not-yet-entered amount - showing a
        // literal 0 here would read as "zero of this ingredient" rather
        // than "amount not set yet".
        value={ingredient().amount || ""}
        placeholder="150"
        onInput={(e) =>
          context.editIngredient({ ...ingredient(), amount: Number(e.currentTarget.value) })
        }
      />
      <input
        type="text"
        class="bg-transparent outline-none w-16 shrink-0"
        value={ingredient().measuringUnit}
        placeholder="g"
        onInput={(e) =>
          context.editIngredient({ ...ingredient(), measuringUnit: e.currentTarget.value })
        }
        spellcheck="false"
      />
      <button
        class="cursor-pointer text-foreground shrink-0"
        onClick={() => context.removeIngredient(id)}
      >
        ✕
      </button>
    </div>
  );
}
