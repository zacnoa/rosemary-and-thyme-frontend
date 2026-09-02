import { createSignal } from "solid-js";
import { useRecipe } from "./context/useRecipe";
import { formatAmount, parseAmount } from "~/utils/parseAmount";

/**
 * Provides the Ingredient function.
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

  /**
 * Provides the revertAmountIfInvalid function.
 */
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
      {/* ml-1/md:ml-2 on top of the row's own gap - the measuring unit field is
          [field-sizing:content], so its right edge can sit right up against this
          button with no visual buffer at all; this pushes the delete target a bit
          further off so it isn't an easy mis-tap while typing the unit. */}
      <button
        class="cursor-pointer text-foreground shrink-0 ml-1 md:ml-2"
        onClick={() => context.removeIngredient(id)}
      >
        ✕
      </button>
    </div>
  );
}
