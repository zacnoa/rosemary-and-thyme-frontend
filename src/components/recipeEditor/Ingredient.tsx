import { createSignal } from "solid-js";
import { useRecipe } from "./context/useRecipe";
import { formatAmount, parseAmount } from "~/utils/parseAmount";

/**
 * One ingredient row: three inputs (name / amount / measuringUnit).
 *
 * name and measuringUnit commit straight to the store on every keystroke,
 * same as before - see the note below on why the input widths are no longer
 * fixed. amount is the odd one out: it needs its own local `amountText`
 * buffer instead of committing directly, because it now accepts fractions
 * ("3/4", "1/2") as well as plain decimals, and a fraction is only a valid
 * number once *both* the numerator and denominator have been typed. Without
 * the buffer, typing "3/4" would hit an unparsable "3/" for one keystroke,
 * and (per the same data-loss bug the old regex-parsed single field had)
 * either reject the keystroke or snap back - so instead the buffer always
 * shows exactly what was typed, and only commits [parseAmount]'s result to
 * the store once it resolves to an actual number. See utils/parseAmount.ts
 * for the parsing/formatting rules themselves.
 *
 * This is still, deliberately, not the old combined "name amount unit"
 * field: name/amount/measuringUnit remain three separate inputs bound to
 * their own store fields (see model/types/recipeTypes.ts) - only amount
 * gained a parsing step, and only because storing it as a number (not a
 * string) is required for a later "scale this recipe's portions" feature to
 * do arithmetic on it.
 */
export default function Ingredient({ id }: { id: string }) {
  const context = useRecipe();
  const ingredient = () => context.recipe.ingredients[id];

  const [amountText, setAmountText] = createSignal(formatAmount(ingredient().amount));

  const commitAmount = (raw: string) => {
    setAmountText(raw);
    const parsed = parseAmount(raw);
    if (parsed !== undefined) {
      context.editIngredient({ ...ingredient(), amount: parsed });
    }
  };

  /** Reverts to the last successfully-parsed amount if the field is left mid-typing an invalid value (e.g. "3/", or "abc"). */
  const revertAmountIfInvalid = () => {
    if (parseAmount(amountText()) === undefined) {
      setAmountText(formatAmount(ingredient().amount));
    }
  };

  return (
    // gap-1 on mobile (md:gap-2): this row lives in a narrow column even on
    // its own full-width mobile line (see BasicInformation.tsx).
    <div class="flex items-center gap-1 md:gap-2">
      <input
        type="text"
        class="bg-transparent outline-none min-w-0 flex-1"
        value={ingredient().name}
        placeholder="Name"
        onInput={(e) =>
          context.editIngredient({ ...ingredient(), name: e.currentTarget.value })
        }
        spellcheck="false"
      />
      {/*
        No more fixed w-10/w-14: at that width a three-digit amount (e.g.
        "150") had its last character clipped. field-sizing:content sizes
        the input to exactly fit whatever's typed, between a min (so an
        empty/one-character value doesn't collapse to nothing) and a max
        (a hard cap for the - practically never happening - case of someone
        typing an unreasonably long amount). type="text" (not "number") so
        "3/4" can be typed at all - which also drops the browser's built-in
        number spinner/range, since that only ever existed on type="number".
      */}
      <input
        type="text"
        inputmode="text"
        class="bg-transparent outline-none min-w-[2ch] max-w-[7ch] shrink-0 [field-sizing:content]"
        value={amountText()}
        placeholder="150"
        onInput={(e) => commitAmount(e.currentTarget.value)}
        onBlur={revertAmountIfInvalid}
      />
      <input
        type="text"
        class="bg-transparent outline-none min-w-[1.5ch] max-w-[8ch] shrink-0 [field-sizing:content]"
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
