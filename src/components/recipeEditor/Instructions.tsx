import { For } from "solid-js";
import { useRecipe } from "./context/useRecipe";
import InstructionItem from "./InstructionItem";

/**
 * The instruction step list. Each step gets its own "+ Add Step" button
 * right after it (inserting there via addInstruction(id) - see
 * RecipeProvider) rather than there being one global "add" button, so a new
 * step can be inserted in the middle of the list, not just appended; the
 * fallback button below the `<For>` only exists to cover the empty-list case,
 * where there's no existing step to attach an "insert after" button to.
 */
export default function Instructions() {
  const context = useRecipe();

  return (
    <div class="flex flex-col gap-4">
      <For each={context.recipe.instructionsOrder}>
        {(id) => (
          <div class="flex flex-col gap-4">
            <InstructionItem id={id} />
            <button
              class="self-start mt-1 px-3 py-1  text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
              onClick={() => context.addInstruction(id)}
            >
              + Add Step
            </button>
          </div>
        )}
      </For>
      {context.recipe.instructionsOrder.length === 0 && (
        <button
          class="self-start mt-1 px-3 py-1 text-fluid-sm-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
          onClick={() => context.addInstruction("")}
        >
          + Add Step
        </button>
      )}
    </div>
  )
}
