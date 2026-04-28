import { For } from "solid-js";
import { useRecipe } from "~/hooks/useRecipe";
import InstructionItem from "./InstructionItem";

export default function Instructions() {
  const context = useRecipe();

  return (
    <div class="flex flex-col gap-4">
      <For each={context.recipe.instructionsOrder}>
        {(id) => (
          <div class="flex flex-col gap-4">
            <InstructionItem id={id} />
            <button
              class="self-start mt-1 px-3 py-1  text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
              onClick={() => context.addInstruction(id)}
            >
              + Add Step
            </button>
          </div>
        )}
      </For>
      {context.recipe.instructionsOrder.length === 0 && (
        <button
          class="self-start mt-1 px-3 py-1 text-sm md:text-base rounded-md bg-linear-to-r from-green to-orange cursor-pointer"
          onClick={() => context.addInstruction("")}
        >
          + Add Step
        </button>
      )}
    </div>
  )
}
